import PendingTimesheetsTable from "@/components/Tables/PendingTimesheetsTable";
import PageTitle from "@/components/Titles/PageTitle";

export default function RecievedTimesheets() {
  return (
    <div>
      <PageTitle pageTitle={'Recieved Timesheets'} />

      <PendingTimesheetsTable />
    </div>
  );
}
