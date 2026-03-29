// Enhanced Project X Bot with comprehensive healthcare catalogue data

// 1️⃣ Enhanced Mock Data - Catalogue & GMC mappings
const catalogue = [
  {
    labName: "Thyrocare",
    pincode: "411014",
    address: "Viman Nagar, Pune",
    contact: "+91-20-2605-7890",
    rating: 4.2,
    reviews: 1250,
    homeCollection: true,
    packages: [
      {
        name: "Full Body Checkup Basic",
        price: 799,
        inclusions: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile"],
        tat: "24 hours",
        isGMC: true,
        fasting: "8-12 hours",
        description: "Comprehensive basic health screening",
      },
      {
        name: "Diabetes Control Panel",
        price: 599,
        inclusions: ["HbA1c", "Fasting Sugar", "Post Prandial Sugar", "Lipid Profile"],
        tat: "24 hours",
        isGMC: false,
        fasting: "8-12 hours",
        description: "Complete diabetes monitoring package",
      },
      {
        name: "Vitamin Panel Complete",
        price: 899,
        inclusions: ["Vitamin D", "Vitamin B12", "Calcium", "Iron"],
        tat: "24 hours",
        isGMC: true,
        fasting: "Not required",
        description: "Essential vitamin deficiency screening",
      },
      {
        name: "Cardiac Risk Assessment",
        price: 1299,
        inclusions: ["Lipid Profile", "ECG", "Troponin", "CRP", "Homocysteine"],
        tat: "24 hours",
        isGMC: true,
        fasting: "8-12 hours",
        description: "Comprehensive heart health evaluation",
      },
    ],
  },
  {
    labName: "Lal Path Labs",
    pincode: "411001",
    address: "Koregaon Park, Pune",
    contact: "+91-20-2605-3456",
    rating: 4.4,
    reviews: 2100,
    homeCollection: true,
    packages: [
      {
        name: "Full Body Checkup Advanced",
        price: 1199,
        inclusions: ["CBC", "Lipid Profile", "LFT", "KFT", "ECG", "ESR", "HbA1c"],
        tat: "48 hours",
        isGMC: true,
        fasting: "10-12 hours",
        description: "Advanced comprehensive health screening",
      },
      {
        name: "Vitamin Essentials",
        price: 1299,
        inclusions: ["Vitamin D", "Vitamin B12", "Vitamin B9", "Calcium", "Iron"],
        tat: "36 hours",
        isGMC: false,
        fasting: "Not required",
        description: "Complete vitamin and mineral assessment",
      },
      {
        name: "Diabetes Care Package",
        price: 699,
        inclusions: ["HbA1c", "Fasting Sugar", "Post Prandial Sugar", "Lipid Profile", "KFT"],
        tat: "36 hours",
        isGMC: true,
        fasting: "8-12 hours",
        description: "Comprehensive diabetes management",
      },
    ],
  },
  {
    labName: "Ruby Hall Labs",
    pincode: "411001",
    address: "Sassoon Road, Pune",
    contact: "+91-20-2605-1234",
    rating: 4.5,
    reviews: 3200,
    homeCollection: false,
    packages: [
      {
        name: "Comprehensive Health Checkup",
        price: 1599,
        inclusions: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile", "ECG", "Chest X-Ray", "Echo"],
        tat: "24 hours",
        isGMC: true,
        fasting: "12 hours",
        description: "Premium comprehensive health assessment",
      },
      {
        name: "Cardiac Risk Assessment",
        price: 999,
        inclusions: ["Lipid Profile", "ECG", "Echo", "Troponin", "CRP"],
        tat: "24 hours",
        isGMC: false,
        fasting: "8-12 hours",
        description: "Detailed cardiac evaluation",
      },
    ],
  },
  {
    labName: "Healthians",
    pincode: "411045",
    address: "Baner, Pune",
    contact: "+91-20-2605-9876",
    rating: 4.3,
    reviews: 1800,
    homeCollection: true,
    packages: [
      {
        name: "Full Body Checkup Premium",
        price: 999,
        inclusions: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile", "Vitamin D"],
        tat: "24 hours",
        isGMC: false,
        fasting: "8-10 hours",
        description: "Premium health screening with vitamins",
      },
      {
        name: "Vitamin D Test",
        price: 599,
        inclusions: ["Vitamin D"],
        tat: "24 hours",
        isGMC: true,
        fasting: "Not required",
        description: "Single vitamin D assessment",
      },
    ],
  },
  {
    labName: "Thyrocare",
    pincode: "411045",
    address: "Baner, Pune",
    contact: "+91-20-2605-7891",
    rating: 4.2,
    reviews: 980,
    homeCollection: true,
    packages: [
      {
        name: "Full Body Checkup Basic",
        price: 799,
        inclusions: ["CBC", "Lipid Profile", "LFT", "KFT", "Thyroid Profile"],
        tat: "24 hours",
        isGMC: true,
        fasting: "8-12 hours",
        description: "Comprehensive basic health screening",
      },
    ],
  },
]

// 2️⃣ Enhanced Utility Functions

// Search catalogue availability by pincode
export function searchByPincode(pincode) {
  const results = catalogue.filter((entry) => entry.pincode === pincode)
  return {
    success: true,
    count: results.length,
    data: results,
  }
}

// Search catalogue availability by lab
export function searchByLab(labName) {
  const results = catalogue.filter((entry) => entry.labName.toLowerCase().includes(labName.toLowerCase()))
  return {
    success: true,
    count: results.length,
    data: results,
  }
}

// Search by lab and pincode
export function searchByLabAndPincode(labName, pincode) {
  const results = catalogue.filter(
    (entry) => entry.labName.toLowerCase().includes(labName.toLowerCase()) && entry.pincode === pincode,
  )
  return {
    success: true,
    count: results.length,
    data: results,
  }
}

// Find packages with requested inclusions
export function findPackageWithInclusions(inclusions) {
  const results = []
  catalogue.forEach((lab) => {
    lab.packages.forEach((pkg) => {
      const hasAll = inclusions.every((inclusion) =>
        pkg.inclusions.some((test) => test.toLowerCase().includes(inclusion.toLowerCase())),
      )
      if (hasAll) {
        results.push({
          lab: lab.labName,
          pincode: lab.pincode,
          address: lab.address,
          package: pkg.name,
          price: pkg.price,
          inclusions: pkg.inclusions,
          tat: pkg.tat,
          isGMC: pkg.isGMC,
          homeCollection: lab.homeCollection,
        })
      }
    })
  })
  return {
    success: true,
    count: results.length,
    data: results,
  }
}

// Check if test centre is GMC mapped
export function isGMCMapped(labName) {
  const labs = catalogue.filter((entry) => entry.labName.toLowerCase().includes(labName.toLowerCase()))

  if (labs.length === 0) {
    return { success: false, message: "Lab not found" }
  }

  const gmcResults = labs.map((lab) => {
    const gmcPackages = lab.packages.filter((pkg) => pkg.isGMC)
    return {
      lab: lab.labName,
      pincode: lab.pincode,
      address: lab.address,
      isGMCMapped: gmcPackages.length > 0,
      gmcPackageCount: gmcPackages.length,
      totalPackages: lab.packages.length,
      gmcPackages: gmcPackages.map((pkg) => pkg.name),
    }
  })

  return {
    success: true,
    data: gmcResults,
  }
}

// Check if GMC package is listed at a centre
export function isGMCPackageAtCentre(labName, packageName) {
  const labs = catalogue.filter((entry) => entry.labName.toLowerCase().includes(labName.toLowerCase()))

  if (labs.length === 0) {
    return { success: false, message: "Lab not found" }
  }

  const results = []
  labs.forEach((lab) => {
    const pkg = lab.packages.find((p) => p.name.toLowerCase().includes(packageName.toLowerCase()))
    if (pkg) {
      results.push({
        lab: lab.labName,
        pincode: lab.pincode,
        package: pkg.name,
        isGMC: pkg.isGMC,
        price: pkg.price,
        inclusions: pkg.inclusions,
      })
    }
  })

  return {
    success: true,
    count: results.length,
    data: results,
  }
}

// Find duplicate packages by name
export function findDuplicatePackages(packageName) {
  const matches = []
  catalogue.forEach((lab) => {
    lab.packages.forEach((pkg) => {
      if (pkg.name.toLowerCase().includes(packageName.toLowerCase())) {
        matches.push({
          lab: lab.labName,
          pincode: lab.pincode,
          address: lab.address,
          package: pkg.name,
          price: pkg.price,
          inclusions: pkg.inclusions,
          tat: pkg.tat,
          isGMC: pkg.isGMC,
          homeCollection: lab.homeCollection,
        })
      }
    })
  })

  // Group by similar names for better duplicate detection
  const grouped = {}
  matches.forEach((match) => {
    const key = match.package.toLowerCase().replace(/\s+/g, " ").trim()
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(match)
  })

  return {
    success: true,
    count: matches.length,
    duplicateGroups: Object.keys(grouped).length,
    data: matches,
    grouped: grouped,
  }
}

// Get all available labs
export function getAllLabs() {
  const uniqueLabs = {}
  catalogue.forEach((entry) => {
    const key = `${entry.labName}-${entry.pincode}`
    if (!uniqueLabs[key]) {
      uniqueLabs[key] = {
        labName: entry.labName,
        pincode: entry.pincode,
        address: entry.address,
        contact: entry.contact,
        rating: entry.rating,
        reviews: entry.reviews,
        homeCollection: entry.homeCollection,
        packageCount: entry.packages.length,
        gmcPackages: entry.packages.filter((pkg) => pkg.isGMC).length,
      }
    }
  })

  return {
    success: true,
    count: Object.keys(uniqueLabs).length,
    data: Object.values(uniqueLabs),
  }
}

// Get package statistics
export function getPackageStats() {
  let totalPackages = 0
  let gmcPackages = 0
  const priceRange = { min: Number.POSITIVE_INFINITY, max: 0 }

  catalogue.forEach((lab) => {
    lab.packages.forEach((pkg) => {
      totalPackages++
      if (pkg.isGMC) gmcPackages++
      if (pkg.price < priceRange.min) priceRange.min = pkg.price
      if (pkg.price > priceRange.max) priceRange.max = pkg.price
    })
  })

  return {
    success: true,
    data: {
      totalPackages,
      gmcPackages,
      nonGmcPackages: totalPackages - gmcPackages,
      gmcPercentage: Math.round((gmcPackages / totalPackages) * 100),
      priceRange,
      totalLabs: catalogue.length,
    },
  }
}
