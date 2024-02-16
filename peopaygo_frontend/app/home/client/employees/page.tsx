import CreateEmployeeModal from "@/components/Modals/CreateEmployeeModal";
import EmployeesTable from "@/components/Tables/EmployeesTable";
import PageTitle from "@/components/Titles/PageTitle";

export default function Employees() {
  return (
    <div>
      <PageTitle pageTitle={'Employees'} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0' }}>
        <CreateEmployeeModal />
      </div>
      <EmployeesTable />
    </div>
  );
}
