import { Coverage, Patient, ExplanationOfBenefit } from 'fhir/r4';

function capitalizeFirstLetterOfWords(
  word: string | undefined
): string | boolean {
  const res =
    typeof word !== 'string'
      ? false
      : word
          .toLowerCase()
          .split(' ')
          .map((w) => {
            return w.charAt(0).toUpperCase() + w.slice(1);
          })
          .join(' ');
  return res;
}

function paymentRecord(
  word: number | undefined,
  status: string | undefined
): number | string {
  const res =
    typeof word !== 'number'
      ? 'No Payment Record'
      : status === 'denied'
      ? 'Payment Denied'
      : word === 0
      ? 'Fully Covered'
      : `Fully Paid - $${word.toString()}`;

  return res;
}

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
      <dd>${coverage.period?.start ?? ''} ${
    `- ${coverage.period?.end}` ?? ''
  }</dd>
      <dt>Type</dt>
      <dd>${coverage.type?.text ?? ''}</dd>
      <dt>Relationship</dt>
      <dd>${coverage.relationship?.text}</dd>
      <dt>Status</dt>
      <dd>${coverage.status}</dd>
      <dt>Payor</dt>
      <dd>${coverage.payor?.[0]?.display ?? ''}</dd>
    </dl>
  `;
}
export function displayBenefit(
  benefit: Coverage | ExplanationOfBenefit | undefined,
  patient: Patient
) {
  if (!benefit || benefit.resourceType !== 'ExplanationOfBenefit') {
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
      <dd>${benefit.id}</dd>
      <dt>Created On</dt>
      <dd>${benefit.created ?? ''}</dd>
       <dt>Physician</dt>
      <dd>${capitalizeFirstLetterOfWords(benefit.provider.display) ?? ''}</dd>
      <dt>Address</dt>
      <dd>${benefit.facility?.display ?? 'Unknown'}</dd>
      <dt>Payment</dt>
      <dd>${benefit.payment?.type?.coding?.map((el) => {
        const status = el.display;
        return `${paymentRecord(benefit.payment?.amount?.value, status)}`;
      })}</dd>      
      <dt>Status</dt>
      <dd>${benefit.status}</dd>
      <dt>Payor</dt>
      <dd>${benefit.insurer.display ?? ''}</dd>
    </dl>
  `;
}

function displayPatientName(patient: Patient): string {
  const patientNameObj = patient?.name?.[0];
  if (!patientNameObj) {
    return '';
  }
  let name = patient?.name?.[0]?.text as string;
  if (name) {
    return name;
  }
  if (patientNameObj.given) {
    name = patientNameObj.given.join(' ');
  }
  if (patientNameObj.family) {
    name = `${name} ${patientNameObj.family}`;
  }
  return name;
}

export default displayCoverage;
