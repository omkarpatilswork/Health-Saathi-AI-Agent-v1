export const providerSlots = {
  PROV001: {
    providerName: "Thyrocare Labs",
    "2025-06-12": {
      availableSlots: ["08:00 AM", "09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
      bookedSlots: ["11:00 AM", "03:00 PM"],
    },
    "2025-06-13": {
      availableSlots: ["07:00 AM", "08:30 AM", "10:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
      bookedSlots: ["09:00 AM", "02:00 PM"],
    },
    "2025-06-14": {
      availableSlots: ["08:00 AM", "09:30 AM", "11:00 AM", "12:30 PM", "02:30 PM", "04:30 PM"],
      bookedSlots: ["10:00 AM", "03:00 PM"],
    },
  },
  PROV002: {
    providerName: "Lal Path Labs",
    "2025-06-12": {
      availableSlots: ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM"],
      bookedSlots: ["12:00 PM", "02:00 PM", "04:00 PM"],
    },
    "2025-06-13": {
      availableSlots: ["08:00 AM", "09:30 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
      bookedSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    },
    "2025-06-14": {
      availableSlots: ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:30 PM"],
      bookedSlots: ["11:00 AM", "02:00 PM"],
    },
  },
  PROV003: {
    providerName: "Ruby Hall Labs",
    "2025-06-12": {
      availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
      bookedSlots: ["12:00 PM", "04:00 PM"],
    },
    "2025-06-13": {
      availableSlots: ["08:00 AM", "09:00 AM", "11:00 AM", "02:00 PM", "05:00 PM"],
      bookedSlots: ["10:00 AM", "01:00 PM", "03:00 PM", "04:00 PM"],
    },
    "2025-06-14": {
      availableSlots: ["09:00 AM", "10:00 AM", "12:00 PM", "01:00 PM", "04:00 PM"],
      bookedSlots: ["11:00 AM", "02:00 PM", "03:00 PM"],
    },
  },
  PROV004: {
    providerName: "Dr. Omkar Patil's Clinic",
    "2025-06-12": {
      availableSlots: ["10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM", "06:00 PM"],
      bookedSlots: ["12:00 PM", "03:00 PM"],
    },
    "2025-06-13": {
      availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"],
      bookedSlots: ["03:00 PM"],
    },
    "2025-06-14": {
      availableSlots: ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"],
      bookedSlots: ["03:00 PM"],
    },
  },
  PROV005: {
    providerName: "Healthians",
    "2025-06-12": {
      availableSlots: ["06:00 AM", "07:00 AM", "08:00 AM", "05:00 PM", "06:00 PM"],
      bookedSlots: ["09:00 AM", "04:00 PM"],
    },
    "2025-06-13": {
      availableSlots: ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "05:00 PM", "06:00 PM"],
      bookedSlots: ["04:00 PM"],
    },
    "2025-06-14": {
      availableSlots: ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "05:00 PM", "06:00 PM"],
      bookedSlots: ["04:00 PM"],
    },
  },
}

export function getAvailableSlots(providerId, date) {
  const providerData = providerSlots[providerId]
  if (!providerData) {
    return { error: "Provider not found" }
  }

  const dateSlots = providerData[date]
  if (!dateSlots) {
    return { error: "No slots available for this date" }
  }

  return {
    providerName: providerData.providerName,
    date: date,
    availableSlots: dateSlots.availableSlots,
    bookedSlots: dateSlots.bookedSlots,
  }
}

export function bookSlot(providerId, slotTime, han, date = "2025-06-12") {
  const providerData = providerSlots[providerId]
  if (!providerData) {
    return {
      status: "error",
      message: "Provider not found",
    }
  }

  const dateSlots = providerData[date]
  if (!dateSlots) {
    return {
      status: "error",
      message: "No slots available for this date",
    }
  }

  if (!dateSlots.availableSlots.includes(slotTime)) {
    return {
      status: "error",
      message: "Slot not available",
    }
  }

  // Simulate booking by moving slot from available to booked
  const slotIndex = dateSlots.availableSlots.indexOf(slotTime)
  dateSlots.availableSlots.splice(slotIndex, 1)
  dateSlots.bookedSlots.push(slotTime)

  const referenceId = `BOOKING${Math.floor(Math.random() * 10000)}`

  return {
    status: "success",
    message: `Slot booked for HAN ${han} at ${providerData.providerName} on ${date} at ${slotTime}`,
    referenceId: referenceId,
    details: {
      han: han,
      providerId: providerId,
      providerName: providerData.providerName,
      date: date,
      time: slotTime,
      bookingId: referenceId,
    },
  }
}

export function getAllProviderSlots() {
  return providerSlots
}
