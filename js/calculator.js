/**
 * FRNDSPACE LUXURY NIGHT VILLA - DYNAMIC PRICING CALCULATOR & WHATSAPP GENERATOR
 */

document.addEventListener('DOMContentLoaded', () => {
  const calcCheckIn = document.getElementById('calcCheckIn');
  const calcCheckOut = document.getElementById('calcCheckOut');
  const calcGuests = document.getElementById('calcGuests');
  const calcStayType = document.getElementById('calcStayType');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');

  const baseRateDisplay = document.getElementById('summaryBaseRate');
  const nightsDisplay = document.getElementById('summaryNights');
  const guestsFeeDisplay = document.getElementById('summaryGuestsFee');
  const addonsTotalDisplay = document.getElementById('summaryAddons');
  const totalAmountDisplay = document.getElementById('summaryTotal');
  const btnBookWhatsapp = document.getElementById('calcBookWhatsapp');

  // Base pricing
  const WEEKDAY_RATE = 14999;
  const WEEKEND_RATE = 19999;
  const INCLUDED_GUESTS = 6;
  const EXTRA_GUEST_FEE = 999;

  // Set default dates (Tomorrow and day after tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  if (calcCheckIn && !calcCheckIn.value) {
    calcCheckIn.value = tomorrow.toISOString().split('T')[0];
  }
  if (calcCheckOut && !calcCheckOut.value) {
    calcCheckOut.value = dayAfter.toISOString().split('T')[0];
  }

  function calculatePrice() {
    if (!calcCheckIn || !calcCheckOut) return;

    const checkInDate = new Date(calcCheckIn.value);
    const checkOutDate = new Date(calcCheckOut.value);

    // Calculate nights
    let nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights < 1) nights = 1;

    // Check if dates fall on weekend (Friday or Saturday)
    let totalBase = 0;
    let curr = new Date(checkInDate);
    for (let i = 0; i < nights; i++) {
      const dayOfWeek = curr.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        totalBase += WEEKEND_RATE;
      } else {
        totalBase += WEEKDAY_RATE;
      }
      curr.setDate(curr.getDate() + 1);
    }

    // Guest calculation
    const guestCount = parseInt(calcGuests ? calcGuests.value : 6) || 6;
    let extraGuests = Math.max(0, guestCount - INCLUDED_GUESTS);
    let guestFee = extraGuests * EXTRA_GUEST_FEE * nights;

    // Addons calculation
    let addonsTotal = 0;
    let selectedAddonNames = [];
    addonCheckboxes.forEach((cb) => {
      const parentCard = cb.closest('.addon-card');
      if (cb.checked) {
        addonsTotal += parseInt(cb.value) || 0;
        if (parentCard) {
          parentCard.classList.add('selected');
          const name = parentCard.querySelector('.addon-name')?.textContent;
          if (name) selectedAddonNames.push(name.trim());
        }
      } else {
        if (parentCard) parentCard.classList.remove('selected');
      }
    });

    const grandTotal = totalBase + guestFee + addonsTotal;

    // Update UI
    if (baseRateDisplay) baseRateDisplay.textContent = `₹${totalBase.toLocaleString('en-IN')}`;
    if (nightsDisplay) nightsDisplay.textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
    if (guestsFeeDisplay) guestsFeeDisplay.textContent = `₹${guestFee.toLocaleString('en-IN')} (${guestCount} guests)`;
    if (addonsTotalDisplay) addonsTotalDisplay.textContent = `₹${addonsTotal.toLocaleString('en-IN')}`;
    if (totalAmountDisplay) totalAmountDisplay.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    // Update WhatsApp link
    if (btnBookWhatsapp) {
      btnBookWhatsapp.onclick = (e) => {
        e.preventDefault();
        const phoneNumber = '918688661938';
        const occasion = calcStayType ? calcStayType.value : 'Night Stay';
        const checkInStr = calcCheckIn.value;
        const checkOutStr = calcCheckOut.value;
        const addonsStr = selectedAddonNames.length > 0 ? selectedAddonNames.join(', ') : 'None';

        const message = 
          `*✨ VILLA RESERVATION INQUIRY - frndspace ✨*%0A` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
          `*Check-In:* ${checkInStr}%0A` +
          `*Check-Out:* ${checkOutStr} (${nights} Night${nights > 1 ? 's' : ''})%0A` +
          `*Guests:* ${guestCount} Guests%0A` +
          `*Occasion:* ${occasion}%0A` +
          `*Selected Add-ons:* ${addonsStr}%0A` +
          `*Estimated Total:* ₹${grandTotal.toLocaleString('en-IN')}%0A` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━%0A` +
          `Please confirm villa availability and booking procedure!`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      };
    }
  }

  // Bind change listeners
  [calcCheckIn, calcCheckOut, calcGuests, calcStayType].forEach((el) => {
    if (el) el.addEventListener('change', calculatePrice);
  });

  addonCheckboxes.forEach((cb) => {
    cb.addEventListener('change', calculatePrice);
  });

  calculatePrice();
});
