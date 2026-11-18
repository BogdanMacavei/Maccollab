var CALENDAR_ID = 'maccollab25@gmail.com';

/* Community chat: messages are stored in a Google Sheet that the
   script creates on first use ("Maccollab – Community chat" in Drive).
   To hide a message from the site, type "hidden" in its status cell. */
var CHAT_SHEET_NAME   = 'Community chat';
var CHAT_NOTIFY_EMAIL = 'maccollab25@gmail.com';   // '' to turn off e-mails for new messages
var CHAT_MAX_PER_10_MIN = 20;                        // flood protection for the whole chat

function doGet(e) {
  try {
    var data = JSON.parse(decodeURIComponent(e.parameter.data || '{}'));
    var endpoint = data.endpoint;

    if (endpoint === 'chat-list') return json_({ ok: true, messages: chatList_() });
    if (endpoint === 'chat-post') return json_(chatPost_(data));

    var calendar = CalendarApp.getCalendarById(CALENDAR_ID);

    if (!calendar) return ok(false, 'Calendar not found');

    if (endpoint === 'tour') {
      var tDate = new Date(data.date + 'T' + (data.time || '10:00') + ':00');
      var tEnd  = new Date(tDate.getTime() + 60 * 60 * 1000);
      calendar.createEvent(
        '🏢 Tour Booking – ' + data.name,
        tDate, tEnd,
        { description:
            'Name: '         + data.name              + '\n' +
            'Email: '        + data.email             + '\n' +
            'Phone: '        + (data.phone     || '—') + '\n' +
            'Interested in: '+ (data.officeType|| '—') + '\n' +
            'Notes: '        + (data.notes     || '—')
        }
      );

    } else if (endpoint === 'desk') {
      var dStart = new Date(data.startDate);
      var dEnd   = new Date(data.endDate || data.startDate);
      dEnd.setDate(dEnd.getDate() + 1);
      calendar.createAllDayEvent(
        '🪑 Desk Booking – ' + data.name + ' (' + (data.deskCount || 1) + ' desk)',
        dStart, dEnd,
        { description:
            'Name: '  + data.name                + '\n' +
            'Email: ' + data.email               + '\n' +
            'Phone: ' + (data.phone    || '—') + '\n' +
            'Notes: ' + (data.message  || '—')
        }
      );

    } else if (endpoint === 'conference') {
      var cDate  = new Date(data.confDate + 'T' + (data.confTime || '09:00') + ':00');
      var hours  = data.duration === 'Full day' ? 8 : (parseInt(data.duration) || 1);
      var cEnd   = new Date(cDate.getTime() + hours * 60 * 60 * 1000);
      calendar.createEvent(
        '🎙 Conference Room – ' + data.name,
        cDate, cEnd,
        { description:
            'Name: '         + data.name                   + '\n' +
            'Email: '        + data.email                  + '\n' +
            'Phone: '        + (data.phone        || '—') + '\n' +
            'Participants: ' + (data.participants  || '—') + '\n' +
            'Duration: '     + (data.duration      || '—') + '\n' +
            'Notes: '        + (data.notes         || '—')
        }
      );
    }

    return ok(true, 'Event created');
  } catch (err) {
    return ok(false, err.toString());
  }
}

/* ─── Community chat ─────────────────────────────────── */

/* Run this once from the Apps Script editor (select "setupChat", press Run)
   so Google asks for the Sheets and Gmail permissions the chat needs. */
function setupChat() {
  var sh = chatSheet_();
  MailApp.getRemainingDailyQuota();
  Logger.log('Chat sheet ready: ' + sh.getParent().getUrl());
}

function chatSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('CHAT_SHEET_ID');
  if (id) {
    var existing = SpreadsheetApp.openById(id);
    return existing.getSheetByName(CHAT_SHEET_NAME) || existing.getSheets()[0];
  }
  var ss = SpreadsheetApp.create('Maccollab – Community chat');
  var sh = ss.getSheets()[0];
  sh.setName(CHAT_SHEET_NAME);
  sh.appendRow(['id', 'time', 'name', 'message', 'status']);
  sh.setFrozenRows(1);
  props.setProperty('CHAT_SHEET_ID', ss.getId());
  return sh;
}

function chatList_() {
  var sh = chatSheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var first = Math.max(2, last - 199);
  var rows = sh.getRange(first, 1, last - first + 1, 5).getValues();
  var out = [];
  rows.forEach(function (r) {
    if (String(r[4]).trim().toLowerCase() === 'hidden') return;
    out.push({ id: String(r[0]), ts: new Date(r[1]).toISOString(), name: String(r[2]), text: String(r[3]) });
  });
  return out.slice(-50);
}

function chatClean_(value, max) {
  var s = String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;   // never let a message run as a spreadsheet formula
  return s;
}

function chatPost_(data) {
  var name = chatClean_(data.name, 40);
  var text = chatClean_(data.text, 500);
  if (!name || !text) return { ok: false, error: 'empty' };
  if (/(https?:\/\/|www\.)/i.test(text)) return { ok: false, error: 'links' };

  var cache = CacheService.getScriptCache();
  var count = Number(cache.get('chat_count') || 0);
  if (count >= CHAT_MAX_PER_10_MIN) return { ok: false, error: 'busy' };
  cache.put('chat_count', String(count + 1), 600);

  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    chatSheet_().appendRow([Utilities.getUuid(), new Date(), name, text, 'visible']);
  } finally {
    lock.releaseLock();
  }

  if (CHAT_NOTIFY_EMAIL) {
    try {
      var id = PropertiesService.getScriptProperties().getProperty('CHAT_SHEET_ID');
      MailApp.sendEmail(CHAT_NOTIFY_EMAIL, 'Mesaj nou în chatul comunității – ' + name,
        name + ' a scris:\n\n' + text + '\n\nCa să ascunzi mesajul, scrie "hidden" în coloana status:\nhttps://docs.google.com/spreadsheets/d/' + id);
    } catch (mailErr) {}
  }
  return { ok: true };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ok(success, msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: success, message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
