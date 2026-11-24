/**
 * Google Apps Script — receives site-visit leads from the website and appends
 * them to a Google Sheet.
 *
 * Setup (5 minutes):
 *  1. Create a Google Sheet (e.g. "Sharda website leads").
 *  2. Extensions → Apps Script, paste this file, save.
 *  3. Deploy → New deployment → type "Web app"
 *       Execute as: Me   ·   Who has access: Anyone
 *  4. Copy the web-app URL (ends in /exec) into VITE_LEAD_ENDPOINT and rebuild the site.
 *
 * The website sends JSON with Content-Type text/plain (avoids a CORS preflight,
 * which Apps Script cannot answer), so we parse e.postData.contents.
 */
const COLUMNS = [
  'submitted_at', 'name', 'mobile', 'project', 'visit_date', 'consent',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'landing_page', 'referrer', 'page',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    // Basic server-side validation (never trust the browser).
    if (!data.name || !/^\+91[6-9]\d{9}$/.test(data.mobile || '')) {
      return json({ ok: false, error: 'invalid' });
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
    // Prefix with ' so Sheets never evaluates user input as a formula.
    sheet.appendRow(COLUMNS.map((k) => (data[k] === undefined ? '' : "'" + String(data[k]).slice(0, 500))));
    // Optional: email the sales team.
    // MailApp.sendEmail('shardadevelopersindore@gmail.com', 'New site-visit lead: ' + data.name,
    //   data.name + ' · ' + data.mobile + ' · ' + data.project + ' · ' + (data.visit_date || 'no date'));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
