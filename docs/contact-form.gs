/**
 * MYL Seguros — Contact Form Handler
 * Google Apps Script Web App
 *
 * DEPLOYMENT STEPS:
 * 1. Open Google Sheets: https://docs.google.com/spreadsheets/d/1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ
 * 2. Extensions → Apps Script
 * 3. Paste this entire file, replacing any existing code
 * 4. Save (Ctrl+S)
 * 5. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Click Deploy → Authorize → Allow
 * 7. Copy the Web app URL
 * 8. Paste it into contacto/index.html as the value of APPS_SCRIPT_URL
 *
 * The script will automatically create the CONTACT_LEADS sheet
 * on first submission if it doesn't already exist.
 */

var SHEET_ID      = '1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ';
var NOTIFY_EMAIL  = 'vargash@segurosmyl.com,mateusyd@segurosmyl.com';
var LEADS_SHEET   = 'CONTACT_LEADS';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.openById(SHEET_ID);

    // Create sheet + header row if it doesn't exist
    var sheet = ss.getSheetByName(LEADS_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(LEADS_SHEET);
      sheet.appendRow(['timestamp', 'nombre', 'telefono', 'email',
                       'categoria', 'mensaje', 'source_page', 'status']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }

    var now = new Date();
    sheet.appendRow([
      now.toISOString(),
      data.nombre      || '',
      data.telefono    || '',
      data.email       || '',
      data.categoria   || '',
      data.mensaje     || '',
      data.source_page || '/contacto/',
      data.status      || 'NEW'
    ]);

    // Email notification
    var body = [
      'Nuevo lead recibido desde el sitio web de M&L Seguros.',
      '',
      'Nombre:     ' + (data.nombre    || ''),
      'Teléfono:   ' + (data.telefono  || ''),
      'Email:      ' + (data.email     || ''),
      'Categoría:  ' + (data.categoria || ''),
      'Mensaje:    ' + (data.mensaje   || ''),
      'Fuente:     ' + (data.source_page || '/contacto/'),
      'Estado:     ' + (data.status    || 'NEW'),
      'Fecha:      ' + now.toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      '',
      'Ver todos los leads:',
      'https://docs.google.com/spreadsheets/d/' + SHEET_ID
    ].join('\n');

    MailApp.sendEmail({
      to:      NOTIFY_EMAIL,
      subject: 'Nuevo lead MYL desde formulario web',
      body:    body
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('MYL Contact Form API — OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
