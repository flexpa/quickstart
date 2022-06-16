import { Coverage } from 'fhir/r4';

function displayCoverage(coverage: Coverage | undefined) {
  if (!coverage) {
    return /* html */ `
        <div>
        Error: Undefined Resource
        <div/>
        `;
  }
  return /* html */ `
  <dl>
    <dt>Beneficiary</dt>
    <dd>${coverage?.beneficiary?.display ?? ""}</dd>
        <dt>ID</dt>
        <dd>${coverage.id}</dd>
        <dt>Period</dt>
        <dd>${coverage.period?.start ?? ""} ${`- ${coverage.period?.end}` ?? ""}</dd>
        <dt>Type</dt>
        <dd>${coverage.type?.text ?? ""}</dd>
        <dt>Relationship</dt>
        <dd>${coverage?.relationship?.text}</dd>
        <dt>Status</dt>
        <dd>${coverage.status}</dd>
        <dt>Payor</dt>
        <dd>${coverage.payor?.[0].display ?? ""}</dd>
  </dl>`;

}
export default displayCoverage;
