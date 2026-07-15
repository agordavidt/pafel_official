document.addEventListener('DOMContentLoaded', function () {


  var WEB3FORMS_ACCESS_KEY = '6cee4839-0d35-4a08-a0a4-626b6befc096';

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
var svcSubnav = document.getElementById('svcSubnav');

// Pages with a dark .page-header need light nav text until the user scrolls
// past it and the white "scrolled" backdrop kicks in.
if (document.querySelector('.page-header')) {
  nav.classList.add('nav-on-dark');
}

var onScroll = function () {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  if (svcSubnav) {
    svcSubnav.style.top = nav.offsetHeight + 'px';
  }
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

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

  var statStrip = document.querySelector('.stat-strip, .stats-band');
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

  /* ---------- Nav: close mobile menu whenever a dropdown item is tapped ---------- */
  document.querySelectorAll('.dropdown-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var navMenuEl = document.getElementById('navMenu');
      if (navMenuEl) {
        var collapseInst = bootstrap.Collapse.getInstance(navMenuEl);
        if (collapseInst) collapseInst.hide();
      }
    });
  });

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

      // Clear any leftover success/error message from a previous open.
      var bkStatusReset = document.getElementById('bkStatus');
      if (bkStatusReset) { bkStatusReset.textContent = ''; bkStatusReset.className = 'form-status'; }
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

      var bkStatus = document.getElementById('bkStatus');

      // ---- Email via Web3Forms (sends to admin@pafelsolutions.com) ----
      var formData = new FormData(bookingForm);
      formData.set('access_key', WEB3FORMS_ACCESS_KEY);
      formData.set('subject', 'New Site Assessment Booking — ' + name);
      formData.set('from_name', 'Pafel Solutions Website');
      formData.set('name', name);
      formData.set('phone', phone);
      formData.set('project_type', project);
      formData.set('preferred_system', system);
      formData.set('scope', scope);
      formData.set('preferred_date', dateLabel);
      formData.set('preferred_time', selectedTime);

      bkSubmit.disabled = true;
      bkSubmit.textContent = 'Sending…';
      if (bkStatus) { bkStatus.textContent = ''; bkStatus.className = 'form-status'; }

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (!result.success) { throw new Error(result.message || 'Web3Forms rejected the submission'); }

          if (bkStatus) {
            bkStatus.textContent = 'Booking request sent — we\'ll confirm by email within one business day.';
            bkStatus.classList.add('is-success');
          }
          bookingForm.reset();
          bkSubmit.disabled = false;
          bkSubmit.textContent = 'Confirm Appointment';

          // Give the visitor time to actually read the success message
          // before the modal closes itself.
          setTimeout(function () {
            var instance = bootstrap.Modal.getOrCreateInstance(modalEl);
            instance.hide();
          }, 2400);
        })
        .catch(function () {
          if (bkStatus) {
            var mailBody = 'Name: ' + name + '\nPhone: ' + phone +
              '\nProject type: ' + project + '\nPreferred system: ' + system +
              '\nScope: ' + scope + '\nPreferred date/time: ' + dateLabel + ' at ' + selectedTime;
            var mailLink = 'mailto:admin@pafelsolutions.com?subject=' +
              encodeURIComponent('Site Assessment Booking — ' + name) +
              '&body=' + encodeURIComponent(mailBody);
            bkStatus.innerHTML = 'Could not send automatically. <a href="' + mailLink + '">Click here to email us directly</a> instead.';
            bkStatus.classList.add('is-error');
          }
          // Left form data intact and modal open so the visitor doesn't lose their input.
          bkSubmit.disabled = false;
          bkSubmit.textContent = 'Confirm Appointment';
        });
    });
  }

  /* ---------- Services page: sub-nav scroll-spy ---------- */
  var svcLinks = document.querySelectorAll('.svc-subnav-link');
  if (svcLinks.length) {
    var svcSections = Array.prototype.map.call(svcLinks, function (link) {
      return document.querySelector(link.getAttribute('href'));
    });

    var setActiveSvcLink = function () {
      var scrollPos = window.scrollY + 140;
      var current = svcSections[0];
      svcSections.forEach(function (section) {
        if (section && section.offsetTop <= scrollPos) current = section;
      });
      svcLinks.forEach(function (link) {
        var match = current && link.getAttribute('href') === '#' + current.id;
        link.classList.toggle('is-active', !!match);
      });
    };

    setActiveSvcLink();
    window.addEventListener('scroll', setActiveSvcLink, { passive: true });
  }

  /* ---------- Projects page: photo lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = document.getElementById('lightboxImg');
    var lbCaption = document.getElementById('lightboxCaption');
    var lbCounter = document.getElementById('lightboxCounter');
    var lbClose = document.getElementById('lightboxClose');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');

    var currentSet = [];
    var currentIndex = 0;

    function renderLightboxImage() {
      var item = currentSet[currentIndex];
      lbImg.classList.add('is-fading');
      setTimeout(function () {
        lbImg.src = item.src;
        lbImg.alt = item.alt;
        lbCaption.textContent = item.caption;
        lbCounter.textContent = (currentIndex + 1) + ' / ' + currentSet.length;
        lbImg.classList.remove('is-fading');
      }, 150);
    }

    function openLightbox(galleryId, startSrc) {
      var nodes = document.querySelectorAll('[data-gallery="' + galleryId + '"]');
      currentSet = Array.prototype.map.call(nodes, function (node) {
        return {
          src: node.getAttribute('src').replace(/w=\d+/, 'w=1600'),
          alt: node.getAttribute('alt') || '',
          caption: node.getAttribute('data-caption') || ''
        };
      });
      currentIndex = Math.max(0, Array.prototype.findIndex.call(nodes, function (node) {
        return node.getAttribute('src') === startSrc;
      }));
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      renderLightboxImage();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.js-gallery-img').forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(img.getAttribute('data-gallery'), img.getAttribute('src'));
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lbPrev.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
      renderLightboxImage();
    });
    lbNext.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % currentSet.length;
      renderLightboxImage();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });
  }

  /* ---------- Contact page: general enquiry form ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var serviceLabels = {
      'hvac-design': 'HVAC Design enquiry',
      'installation': 'Installation enquiry',
      'maintenance': 'Maintenance & SLA enquiry',
      'sales-consulting': 'Sales Consulting enquiry'
    };
    var serviceParam = new URLSearchParams(window.location.search).get('service');
    var cSubjectField = document.getElementById('cSubject');
    if (serviceParam && serviceLabels[serviceParam] && cSubjectField && !cSubjectField.value) {
      cSubjectField.value = serviceLabels[serviceParam];
    }

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

      var cSubmit = document.getElementById('cSubmit');
      var cStatus = document.getElementById('cStatus');

      var formData = new FormData();
      formData.set('access_key', WEB3FORMS_ACCESS_KEY);
      formData.set('subject', 'Pafel Solutions — ' + subject);
      formData.set('from_name', 'Pafel Solutions Website');
      formData.set('name', name);
      formData.set('email', email);
      formData.set('message', message);

      cSubmit.disabled = true;
      cSubmit.textContent = 'Sending…';
      if (cStatus) { cStatus.textContent = ''; cStatus.className = 'form-status'; }

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (!result.success) { throw new Error(result.message || 'Web3Forms rejected the submission'); }

          if (cStatus) {
            cStatus.textContent = 'Message sent — we\'ll reply by email soon.';
            cStatus.classList.add('is-success');
          }
          contactForm.reset();
        })
        .catch(function () {
          // Fallback so the message is never lost if the API call fails.
          // Non-forcing link (rather than auto-redirecting) so the visitor
          // keeps their filled-in form and chooses when to switch apps.
          if (cStatus) {
            var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
            var mailLink = 'mailto:admin@pafelsolutions.com?subject=' +
              encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            cStatus.innerHTML = 'Could not send automatically. <a href="' + mailLink + '">Click here to email us directly</a> instead.';
            cStatus.classList.add('is-error');
          }
        })
        .finally(function () {
          cSubmit.disabled = false;
          cSubmit.textContent = 'Send Message';
        });
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