import CreateTimeSheetModal from "@/components/Modals/CreateTimeSheetModal";
import TimesheetsTable from "@/components/Tables/TimesheetsTable";
import PageTitle from "@/components/Titles/PageTitle";

export default function Timesheets() {
  return (
    <div>
      <PageTitle pageTitle={'Timesheets'} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0' }}>
        <CreateTimeSheetModal />
      </div>
      <TimesheetsTable />
    </div>
  );
}
