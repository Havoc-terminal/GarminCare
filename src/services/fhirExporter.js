// HL7 FHIR R4 / ABDM Exporter for GraminCare Patient Records

export function exportPatientToFHIR(patient) {
  const latestVisit = patient.vitalsHistory?.[0] || {};
  
  const fhirBundle = {
    resourceType: "Bundle",
    id: `gramincare-fhir-${patient.id}`,
    meta: {
      lastUpdated: new Date().toISOString(),
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"]
    },
    type: "document",
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patient.id}`,
        resource: {
          resourceType: "Patient",
          id: patient.id,
          identifier: [
            {
              system: "https://healthid.ndhm.gov.in",
              value: patient.abhaId || "UNLINKED"
            },
            {
              system: "https://gramincare.maharashtra.gov.in/patient-id",
              value: patient.id
            }
          ],
          name: [
            {
              text: patient.name
            }
          ],
          gender: patient.gender.toLowerCase(),
          telecom: patient.phone ? [
            {
              system: "phone",
              value: patient.phone
            }
          ] : [],
          address: [
            {
              city: patient.village,
              district: "Pune",
              state: "Maharashtra",
              country: "IND"
            }
          ]
        }
      },
      {
        fullUrl: `urn:uuid:observation-bp-${patient.id}`,
        resource: {
          resourceType: "Observation",
          id: `obs-bp-${patient.id}`,
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "vital-signs",
                  display: "Vital Signs"
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "85354-9",
                display: "Blood pressure panel with all children optional"
              }
            ]
          },
          subject: {
            reference: `urn:uuid:patient-${patient.id}`
          },
          effectiveDateTime: latestVisit.timestamp || new Date().toISOString(),
          component: [
            {
              code: {
                coding: [
                  { system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }
                ]
              },
              valueQuantity: {
                value: parseFloat(latestVisit.bpSystolic) || 120,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mm[Hg]"
              }
            },
            {
              code: {
                coding: [
                  { system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }
                ]
              },
              valueQuantity: {
                value: parseFloat(latestVisit.bpDiastolic) || 80,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mm[Hg]"
              }
            }
          ]
        }
      },
      {
        fullUrl: `urn:uuid:observation-spo2-${patient.id}`,
        resource: {
          resourceType: "Observation",
          id: `obs-spo2-${patient.id}`,
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "2708-6", display: "Oxygen saturation in Arterial blood by Pulse oximetry" }
            ]
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          valueQuantity: {
            value: parseFloat(latestVisit.spo2) || 98,
            unit: "%",
            system: "http://unitsofmeasure.org",
            code: "%"
          }
        }
      }
    ]
  };

  return JSON.stringify(fhirBundle, null, 2);
}
