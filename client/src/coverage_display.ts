import { Coverage } from 'fhir/r4';

function displayCoverage(resource: Coverage | undefined) {
  if (!resource) {
    return /* html */ `
        <div>
        Error: Undefined Resource
        <div/>
        `;
  }
  return /* html */ `
    <div>
        ID
        ${resource.id}
        Period Start
        ${resource.period?.start ?? ""}
        Period End
        ${resource.period?.end ?? ""}
        Type
        ${resource.type?.text ?? ""}
        Status
        ${resource.status}
        Payor
        ${resource.payor?.[0].display ?? ""}
    </div>`;

}
export default displayCoverage;
