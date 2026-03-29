// GMC Networks Data Structure
export const gmcNetworks = {
  GMC_NETWORK_001: {
    networkName: "Primary Healthcare Network",
    products: {
      BALIC01: {
        productName: "Basic Health Insurance",
        policyDetails: "Basic coverage with essential tests",
      },
      TRAVIS07: {
        productName: "Premium Health Plan",
        policyDetails: "Comprehensive coverage with advanced diagnostics",
      },
      WELLNESS03: {
        productName: "Wellness Package",
        policyDetails: "Preventive health screening package",
      },
    },
    providers: [
      {
        providerName: "Thyrocare",
        pincode: "411014",
        address: "Viman Nagar, Pune",
        contact: "+91-20-2605-7890",
        packages: [
          {
            packageName: "Full Body Basic",
            testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT"],
            availableInProducts: ["BALIC01", "WELLNESS03"],
            price: 799,
            tat: "24 hours",
          },
          {
            packageName: "Diabetes Control",
            testsIncluded: ["HbA1c", "Fasting Sugar", "Post Prandial Sugar"],
            availableInProducts: ["TRAVIS07", "WELLNESS03"],
            price: 599,
            tat: "24 hours",
          },
          {
            packageName: "Vitamin Panel",
            testsIncluded: ["Vitamin D", "Vitamin B12", "Calcium"],
            availableInProducts: ["TRAVIS07"],
            price: 899,
            tat: "24 hours",
          },
        ],
      },
      {
        providerName: "Thyrocare",
        pincode: "411045",
        address: "Baner, Pune",
        contact: "+91-20-2605-7891",
        packages: [
          {
            packageName: "Full Body Basic",
            testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT"],
            availableInProducts: ["BALIC01", "WELLNESS03"],
            price: 799,
            tat: "24 hours",
          },
          {
            packageName: "Cardiac Risk Assessment",
            testsIncluded: ["Lipid Profile", "ECG", "Troponin", "CRP"],
            availableInProducts: ["TRAVIS07"],
            price: 1299,
            tat: "24 hours",
          },
        ],
      },
      {
        providerName: "Lal Path Labs",
        pincode: "411014",
        address: "Kharadi, Pune",
        contact: "+91-20-2605-3456",
        packages: [
          {
            packageName: "Full Body Silver Package",
            testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT", "ESR", "Urine"],
            availableInProducts: ["BALIC01", "TRAVIS07"],
            price: 1199,
            tat: "48 hours",
          },
          {
            packageName: "Vitamin Essentials",
            testsIncluded: ["Vitamin D", "Vitamin B12", "Vitamin B9", "Iron"],
            availableInProducts: ["TRAVIS07", "WELLNESS03"],
            price: 1299,
            tat: "36 hours",
          },
        ],
      },
      {
        providerName: "Healthians",
        pincode: "411014",
        address: "Viman Nagar, Pune",
        contact: "+91-20-2605-9876",
        packages: [
          {
            packageName: "Full Body Silver Package",
            testsIncluded: ["CBC", "Urine", "Thyroid Profile"],
            availableInProducts: ["TRAVIS07"],
            price: 999,
            tat: "24 hours",
          },
          {
            packageName: "Basic Health Checkup",
            testsIncluded: ["CBC", "Lipid Profile", "Blood Sugar"],
            availableInProducts: ["BALIC01", "WELLNESS03"],
            price: 699,
            tat: "24 hours",
          },
        ],
      },
      {
        providerName: "Ruby Hall Labs",
        pincode: "411001",
        address: "Sassoon Road, Pune",
        contact: "+91-20-2605-1234",
        packages: [
          {
            packageName: "Comprehensive Health Checkup",
            testsIncluded: ["CBC", "Lipid Profile", "LFT", "KFT", "ECG", "Chest X-Ray"],
            availableInProducts: ["TRAVIS07"],
            price: 1599,
            tat: "24 hours",
          },
          {
            packageName: "Cardiac Screening",
            testsIncluded: ["ECG", "Echo", "Lipid Profile", "Troponin"],
            availableInProducts: ["TRAVIS07", "WELLNESS03"],
            price: 999,
            tat: "24 hours",
          },
        ],
      },
    ],
  },
}

// Query Processing Functions

// Type 1: Labs available in pincode for product
export function getLabsInPincodeForProduct(pincode, product) {
  const results = []

  Object.values(gmcNetworks).forEach((network) => {
    network.providers.forEach((provider) => {
      if (provider.pincode === pincode) {
        // Check if any package is available for the requested product
        const hasProductPackages = provider.packages.some((pkg) => pkg.availableInProducts.includes(product))

        if (hasProductPackages) {
          results.push({
            providerName: provider.providerName,
            address: provider.address,
            contact: provider.contact,
            packagesCount: provider.packages.filter((pkg) => pkg.availableInProducts.includes(product)).length,
          })
        }
      }
    })
  })

  return {
    success: true,
    count: results.length,
    data: results,
    query: { pincode, product },
  }
}

// Type 2: Tests available in product at provider and pincode
export function getTestsInProductAtProvider(product, providerName, pincode) {
  const results = []
  let providerFound = false

  Object.values(gmcNetworks).forEach((network) => {
    network.providers.forEach((provider) => {
      if (provider.providerName.toLowerCase().includes(providerName.toLowerCase()) && provider.pincode === pincode) {
        providerFound = true

        provider.packages.forEach((pkg) => {
          if (pkg.availableInProducts.includes(product)) {
            results.push({
              packageName: pkg.packageName,
              testsIncluded: pkg.testsIncluded,
              price: pkg.price,
              tat: pkg.tat,
            })
          }
        })
      }
    })
  })

  // Get unique tests
  const allTests = [...new Set(results.flatMap((pkg) => pkg.testsIncluded))]

  return {
    success: providerFound,
    count: allTests.length,
    data: {
      provider: providerName,
      pincode: pincode,
      product: product,
      packages: results,
      allTests: allTests,
    },
    query: { product, providerName, pincode },
  }
}

// Type 3: Compare packages with specific test between providers
export function comparePackagesWithTest(testName, provider1, provider2, pincode = null) {
  const provider1Results = []
  const provider2Results = []

  Object.values(gmcNetworks).forEach((network) => {
    network.providers.forEach((provider) => {
      const matchesProvider1 = provider.providerName.toLowerCase().includes(provider1.toLowerCase())
      const matchesProvider2 = provider.providerName.toLowerCase().includes(provider2.toLowerCase())
      const matchesPincode = !pincode || provider.pincode === pincode

      if (matchesPincode) {
        provider.packages.forEach((pkg) => {
          const hasTest = pkg.testsIncluded.some((test) => test.toLowerCase().includes(testName.toLowerCase()))

          if (hasTest) {
            const packageData = {
              providerName: provider.providerName,
              pincode: provider.pincode,
              address: provider.address,
              packageName: pkg.packageName,
              testsIncluded: pkg.testsIncluded,
              availableInProducts: pkg.availableInProducts,
              price: pkg.price,
              tat: pkg.tat,
            }

            if (matchesProvider1) {
              provider1Results.push(packageData)
            }
            if (matchesProvider2) {
              provider2Results.push(packageData)
            }
          }
        })
      }
    })
  })

  return {
    success: true,
    data: {
      testName: testName,
      provider1: {
        name: provider1,
        packages: provider1Results,
      },
      provider2: {
        name: provider2,
        packages: provider2Results,
      },
    },
    query: { testName, provider1, provider2, pincode },
  }
}

// Get all available products
export function getAllProducts() {
  const products = []
  Object.values(gmcNetworks).forEach((network) => {
    Object.entries(network.products).forEach(([code, details]) => {
      products.push({
        code: code,
        name: details.productName,
        description: details.policyDetails,
      })
    })
  })
  return products
}

// Get all available providers
export function getAllProviders() {
  const providers = []
  Object.values(gmcNetworks).forEach((network) => {
    network.providers.forEach((provider) => {
      providers.push({
        name: provider.providerName,
        pincode: provider.pincode,
        address: provider.address,
      })
    })
  })
  return providers
}
