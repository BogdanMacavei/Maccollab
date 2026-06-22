var CALENDAR_ID = 'maccollab25@gmail.com';

function doPost(e) {
  try {
    var raw  = e.postData ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var endpoint = data.endpoint;
    var calendar = CalendarApp.getCalendarById(CALENDAR_ID);

    if (!calendar) {
      return ok(false, 'Calendar not found');
    }

    if (endpoint === 'tour') {
      var tDate = new Date(data.date + 'T' + (data.time || '10:00') + ':00');
      var tEnd  = new Date(tDate.getTime() + 60 * 60 * 1000);
      calendar.createEvent(
        '🏢 Tour Booking – ' + data.name,
        tDate, tEnd,
        { description:
            'Name: '        + data.name             + '\n' +
            'Email: '       + data.email            + '\n' +
            'Phone: '       + (data.phone || '—') + '\n' +
            'Interested in: '+ (data.officeType||'—')+ '\n'+
            'Notes: '       + (data.notes || '—')
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
            'Name: '  + data.name               + '\n' +
            'Email: ' + data.email              + '\n' +
            'Phone: ' + (data.phone || '—')  + '\n' +
            'Notes: ' + (data.message || '—')
        }
      );

    } else if (endpoint === 'conference') {
      var cDate   = new Date(data.confDate + 'T' + (data.confTime || '09:00') + ':00');
      var hours   = data.duration === 'Full day' ? 8 : (parseInt(data.duration) || 1);
      var cEnd    = new Date(cDate.getTime() + hours * 60 * 60 * 1000);
      calendar.createEvent(
        '🎤 Conference Room – ' + data.name,
        cDate, cEnd,
        { description:
            'Name: '         + data.name                  + '\n' +
            'Email: '        + data.email                 + '\n' +
            'Phone: '        + (data.phone || '—')     + '\n' +
            'Participants: ' + (data.participants || '—') + '\n'+
            'Duration: '     + (data.duration || '—') + '\n' +
            'Notes: '        + (data.notes || '—')
        }
      );
    }

    return ok(true, 'Event created');
  } catch (err) {
    return ok(false, err.toString());
  }
}

function ok(success, msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: success, message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
