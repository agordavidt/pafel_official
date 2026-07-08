document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 500);
  });

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById('mainNav');
  var onScroll = function () {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Hero entrance (GSAP) ---------- */
  if (window.gsap) {
    gsap.from('.hero-copy > *', {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.6
    });
    gsap.from('.hero-media', {
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      ease: 'power2.out',
      delay: 0.75
    });
  }

  /* ---------- Stat counters ---------- */
  var statNums = document.querySelectorAll('.stat-num');
  var counted = false;

  function animateCounters() {
    statNums.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var current = { val: 0 };
      if (window.gsap) {
        gsap.to(current, {
          val: target,
          duration: 1.4,
          ease: 'power1.out',
          onUpdate: function () {
            el.textContent = Math.round(current.val);
          }
        });
      } else {
        el.textContent = target;
      }
    });
  }

  var statStrip = document.querySelector('.stat-strip');
  if (statStrip && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(statStrip);
  } else if (statStrip) {
    animateCounters();
  }

  /* ---------- Booking modal: dynamic calendar + time slots ---------- */
  var modalEl = document.getElementById('assessmentModal');
  if (modalEl) {
    var calGrid = document.getElementById('calGrid');
    var calMonthLabel = document.getElementById('calMonthLabel');
    var calPrev = document.getElementById('calPrev');
    var calNext = document.getElementById('calNext');
    var timeGrid = document.getElementById('timeGrid');
    var timeEmpty = document.getElementById('timeEmpty');
    var selectedSummary = document.getElementById('selectedSummary');
    var bookingForm = document.getElementById('assessmentForm');
    var bkSubmit = document.getElementById('bkSubmit');

    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var weekdayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var baseSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'];

    var today, viewYear, viewMonth, selectedDate, selectedTime;

    function stripTime(d) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function resetBookingState() {
      var now = new Date();
      today = stripTime(now);
      viewYear = today.getFullYear();
      viewMonth = today.getMonth();
      selectedDate = null;
      selectedTime = null;
      renderCalendar();
      renderTimeSlots();
      updateSummary();
    }

    function renderCalendar() {
      calMonthLabel.textContent = monthNames[viewMonth] + ' ' + viewYear;

      var isCurrentMonth = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
      calPrev.disabled = isCurrentMonth;

      var firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      calGrid.innerHTML = '';
      var totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

      for (var i = 0; i < totalCells; i++) {
        var dayNum = i - firstDayIndex + 1;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';

        if (dayNum < 1 || dayNum > daysInMonth) {
          btn.classList.add('is-muted');
          btn.disabled = true;
          btn.textContent = '';
        } else {
          var cellDate = new Date(viewYear, viewMonth, dayNum);
          btn.textContent = dayNum;

          if (cellDate < today) {
            btn.disabled = true;
          }
          if (cellDate.getTime() === today.getTime()) {
            btn.classList.add('is-today');
          }
          if (selectedDate && cellDate.getTime() === selectedDate.getTime()) {
            btn.classList.add('is-selected');
          }
          (function (d) {
            btn.addEventListener('click', function () {
              selectedDate = d;
              selectedTime = null;
              renderCalendar();
              renderTimeSlots();
              updateSummary();
            });
          })(cellDate);
        }
        calGrid.appendChild(btn);
      }
    }

    function parseSlotToMinutes(slot) {
      var parts = slot.split(' ');
      var hm = parts[0].split(':');
      var hour = parseInt(hm[0], 10);
      var min = parseInt(hm[1], 10);
      if (parts[1] === 'PM' && hour !== 12) hour += 12;
      if (parts[1] === 'AM' && hour === 12) hour = 0;
      return hour * 60 + min;
    }

    function renderTimeSlots() {
      timeGrid.innerHTML = '';

      if (!selectedDate) {
        timeEmpty.textContent = 'Select a date to see available times.';
        timeEmpty.style.display = 'block';
        return;
      }

      var isToday = selectedDate.getTime() === today.getTime();
      var nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

      var available = baseSlots.filter(function (slot) {
        return !isToday || parseSlotToMinutes(slot) > nowMinutes;
      });

      if (available.length === 0) {
        timeEmpty.textContent = 'No more slots today — please choose another date.';
        timeEmpty.style.display = 'block';
        return;
      }

      timeEmpty.style.display = 'none';
      available.forEach(function (slot) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot-btn';
        if (slot === selectedTime) btn.classList.add('is-selected');
        btn.textContent = slot;
        btn.addEventListener('click', function () {
          selectedTime = slot;
          renderTimeSlots();
          updateSummary();
        });
        timeGrid.appendChild(btn);
      });
    }

    function updateSummary() {
      if (selectedDate && selectedTime) {
        var label = weekdayNames[selectedDate.getDay()] + ', ' + selectedDate.getDate() + ' ' +
          monthNames[selectedDate.getMonth()].slice(0, 3) + ' ' + selectedDate.getFullYear();
        selectedSummary.textContent = 'Selected: ' + label + ' at ' + selectedTime;
        selectedSummary.classList.add('is-set');
      } else if (selectedDate) {
        selectedSummary.textContent = 'Now pick an available time above.';
        selectedSummary.classList.remove('is-set');
      } else {
        selectedSummary.textContent = 'No date selected yet.';
        selectedSummary.classList.remove('is-set');
      }
    }

    calPrev.addEventListener('click', function () {
      viewMonth -= 1;
      if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
      renderCalendar();
    });
    calNext.addEventListener('click', function () {
      viewMonth += 1;
      if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
      renderCalendar();
    });

    modalEl.addEventListener('show.bs.modal', resetBookingState);

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }
      if (!selectedDate || !selectedTime) {
        selectedSummary.textContent = 'Please select a date and time before confirming.';
        selectedSummary.classList.remove('is-set');
        return;
      }

      var name = document.getElementById('bkName').value.trim();
      var phone = document.getElementById('bkPhone').value.trim();
      var project = document.getElementById('bkProject').value;
      var system = document.getElementById('bkSystem').value;
      var scope = document.getElementById('bkScope').value.trim() || '—';
      var dateLabel = weekdayNames[selectedDate.getDay()] + ', ' + selectedDate.getDate() + ' ' +
        monthNames[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear();

      // NOTE: replace with Pafel Solutions' actual WhatsApp business number
      var whatsappNumber = '2340000000000';
      var message = 'PAFEL SOLUTIONS: New Site Assessment Request%0A' +
        'Date: ' + encodeURIComponent(dateLabel) + ' at ' + encodeURIComponent(selectedTime) + '%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Phone: ' + encodeURIComponent(phone) + '%0A' +
        'Project type: ' + encodeURIComponent(project) + '%0A' +
        'Preferred system: ' + encodeURIComponent(system) + '%0A' +
        'Scope: ' + encodeURIComponent(scope);
      var waLink = 'https://wa.me/' + whatsappNumber + '?text=' + message;

      bkSubmit.disabled = true;
      bkSubmit.textContent = 'Opening WhatsApp…';

      setTimeout(function () {
        window.open(waLink, '_blank');
        var instance = bootstrap.Modal.getOrCreateInstance(modalEl);
        instance.hide();
        bookingForm.reset();
        bkSubmit.disabled = false;
        bkSubmit.textContent = 'Confirm Appointment';
      }, 700);
    });
  }

  /* ---------- Contact page: general enquiry form (mailto) ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var name = document.getElementById('cName').value.trim();
      var email = document.getElementById('cEmail').value.trim();
      var subject = document.getElementById('cSubject').value.trim() || 'Website enquiry';
      var message = document.getElementById('cMessage').value.trim();

      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      var mailLink = 'mailto:admin@pafelsolutions.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      var cSubmit = document.getElementById('cSubmit');
      cSubmit.textContent = 'Opening your email app…';
      setTimeout(function () {
        window.location.href = mailLink;
        cSubmit.textContent = 'Send Message';
        contactForm.reset();
      }, 500);
    });
  }

  /* ---------- Close mobile menu on link click ---------- */
  var navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.querySelectorAll('a.nav-link, a.btn').forEach(function (link) {
      link.addEventListener('click', function () {
        var collapse = bootstrap.Collapse.getInstance(navMenu);
        if (collapse) collapse.hide();
      });
    });
  }
});


