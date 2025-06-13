// Mock API responses for Project X
// In a real implementation, these would be actual API calls

export interface Provider {
  id: string
  name: string
  locations: string[]
  services: string[]
  specialties: string[]
}

export interface Slot {
  time: string
  available: boolean
  price?: number
}

export interface Package {
  id: string
  name: string
  provider: string
  price: number
  tests: string[]
  tat: string
  homeCollection: boolean
}

export interface Customer {
  han: string
  name: string
  contact: string
  pastBookings: string[]
  prescriptions: string[]
  preferredLocation: string
}

// Mock data
const providers: Provider[] = [
  {
    id: "thy001",
    name: "Thyrocare",
    locations: ["400001", "411045", "560001"],
    services: ["Blood Tests", "Full Body Checkup", "Thyroid Profile"],
    specialties: ["Pathology", "Preventive Health"],
  },
  {
    id: "lal001",
    name: "Lal Path Labs",
    locations: ["400001", "411045", "110001"],
    services: ["Blood Tests", "Full Body Checkup", "Cardiac Profile"],
    specialties: ["Pathology", "Cardiology"],
  },
  {
    id: "med001",
    name: "Medilab Diagnostics",
    locations: ["560001", "560076"],
    services: ["MRI", "CT Scan", "X-Ray", "Ultrasound"],
    specialties: ["Radiology", "Orthopedics"],
  },
  {
    id: "shetty001",
    name: "Dr. Shetty's Clinic",
    locations: ["400001", "400050"],
    services: ["Consultation", "ECG", "Echo"],
    specialties: ["Cardiology"],
  },
]

const packages: Package[] = [
  {
    id: "thy-fbp-001",
    name: "Full Body Checkup",
    provider: "Thyrocare",
    price: 799,
    tests: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile"],
    tat: "24 hours",
    homeCollection: true,
  },
  {
    id: "lal-fbp-001",
    name: "Full Body Checkup",
    provider: "Lal Path Labs",
    price: 1199,
    tests: ["CBC", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Profile", "ECG", "ESR"],
    tat: "48 hours",
    homeCollection: true,
  },
  {
    id: "thy-dia-001",
    name: "Diabetes Control Package",
    provider: "Thyrocare",
    price: 599,
    tests: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Lipid Profile"],
    tat: "24 hours",
    homeCollection: true,
  },
  {
    id: "lal-dia-001",
    name: "Diabetes Care Package",
    provider: "Lal Path Labs",
    price: 699,
    tests: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Blood Sugar", "Lipid Profile", "Kidney Function Test"],
    tat: "36 hours",
    homeCollection: true,
  },
  {
    id: "thy-thy-001",
    name: "Thyroid Profile",
    provider: "Thyrocare",
    price: 399,
    tests: ["T3", "T4", "TSH"],
    tat: "24 hours",
    homeCollection: true,
  },
]

const customers: Customer[] = [
  {
    han: "HAN1123",
    name: "Rahul Sharma",
    contact: "9876543210",
    pastBookings: ["Full Body Checkup - Thyrocare (12/01/2025)", "Consultation - Dr. Shetty's Clinic (05/03/2025)"],
    prescriptions: ["Thyroid Medication", "Vitamin D Supplements"],
    preferredLocation: "400001",
  },
  {
    han: "HAN2234",
    name: "Priya Patel",
    contact: "8765432109",
    pastBookings: ["Diabetes Control Package - Thyrocare (22/02/2025)"],
    prescriptions: ["Insulin", "Blood Pressure Medication"],
    preferredLocation: "560001",
  },
]

// Mock API functions
export async function getCustomerDetails(han: string): Promise<Customer | null> {
  const customer = customers.find((c) => c.han === han)
  return customer || null
}

export async function getProviderNetwork(location?: string, specialty?: string, service?: string): Promise<Provider[]> {
  let filteredProviders = [...providers]

  if (location) {
    filteredProviders = filteredProviders.filter((p) => p.locations.includes(location))
  }

  if (specialty) {
    filteredProviders = filteredProviders.filter((p) =>
      p.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase())),
    )
  }

  if (service) {
    filteredProviders = filteredProviders.filter((p) =>
      p.services.some((s) => s.toLowerCase().includes(service.toLowerCase())),
    )
  }

  return filteredProviders
}

export async function getSlotAvailability(providerId: string, han: string, date: string): Promise<Slot[]> {
  // Generate mock slots
  const slots: Slot[] = []
  const startHour = 9
  const endHour = 17

  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push({
      time: `${hour}:00`,
      available: Math.random() > 0.3, // 70% chance of availability
      price: hour < 12 ? 500 : 600, // Morning slots cheaper
    })
  }

  return slots
}

export async function getPackages(pincode?: string, providerName?: string): Promise<Package[]> {
  let filteredPackages = [...packages]

  if (providerName) {
    filteredPackages = filteredPackages.filter((p) => p.provider.toLowerCase().includes(providerName.toLowerCase()))
  }

  if (pincode) {
    // Filter packages by providers that serve this pincode
    const providersInPincode = providers.filter((p) => p.locations.includes(pincode))
    const providerNames = providersInPincode.map((p) => p.name)
    filteredPackages = filteredPackages.filter((p) => providerNames.includes(p.provider))
  }

  return filteredPackages
}

export async function comparePackages(
  packageA: string,
  packageB: string,
): Promise<{ packageA: Package; packageB: Package; differences: string[] }> {
  const pkgA = packages.find((p) => p.id === packageA) || packages.find((p) => p.name === packageA)
  const pkgB = packages.find((p) => p.id === packageB) || packages.find((p) => p.name === packageB)

  if (!pkgA || !pkgB) {
    throw new Error("One or both packages not found")
  }

  // Find differences
  const differences: string[] = []

  if (pkgA.price !== pkgB.price) {
    differences.push(`Price: ${pkgA.provider} (₹${pkgA.price}) vs ${pkgB.provider} (₹${pkgB.price})`)
  }

  if (pkgA.tat !== pkgB.tat) {
    differences.push(`TAT: ${pkgA.provider} (${pkgA.tat}) vs ${pkgB.provider} (${pkgB.tat})`)
  }

  // Tests in A but not in B
  const testsOnlyInA = pkgA.tests.filter((test) => !pkgB.tests.includes(test))
  if (testsOnlyInA.length > 0) {
    differences.push(`Tests only in ${pkgA.provider}: ${testsOnlyInA.join(", ")}`)
  }

  // Tests in B but not in A
  const testsOnlyInB = pkgB.tests.filter((test) => !pkgA.tests.includes(test))
  if (testsOnlyInB.length > 0) {
    differences.push(`Tests only in ${pkgB.provider}: ${testsOnlyInB.join(", ")}`)
  }

  return {
    packageA: pkgA,
    packageB: pkgB,
    differences,
  }
}
