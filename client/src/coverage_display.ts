import { Coverage, Patient } from 'fhir/r4';

function displayCoverage(coverage: Coverage | undefined, patient: Patient) {
  if (!coverage || coverage.resourceType !== 'Coverage') {
    return /* html */ `
        <div>
        Error: Undefined Resource
        <div/>
        `;
  }
  return /* html */ `
    <dl>
      <dt>Beneficiary</dt>
      <dd>${displayPatientName(patient)}</dd>      
      <dt>ID</dt>
      <dd>${coverage.id}</dd>
      <dt>Period</dt>
      <dd>${coverage.period?.start ?? ""} ${`- ${coverage.period?.end}` ?? ""}</dd>
      <dt>Type</dt>
      <dd>${coverage.type?.text ?? ""}</dd>
      <dt>Relationship</dt>
      <dd>${coverage.relationship?.text}</dd>
      <dt>Status</dt>
      <dd>${coverage.status}</dd>
      <dt>Payor</dt>
      <dd>${coverage.payor?.[0]?.display ?? ""}</dd>
    </dl>
  `;
}

function displayPatientName(patient: Patient): string {
  const patientNameObj = patient?.name?.[0];
  if (!patientNameObj) {
    return "";
  }
  let name = patient?.name?.[0]?.text as string;
  if (name) {
    return name;
  }
  if (patientNameObj.given) {
    name = patientNameObj.given.join(" ");
  }
  if (patientNameObj.family) {
    name = `${name} ${patientNameObj.family}`;
  }
  return name;
}

export default displayCoverage;
