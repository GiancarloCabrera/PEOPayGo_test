import CreateClientModal from "@/components/Modals/CreateClientModal";
import ClientsTable from "@/components/Tables/ClientsTable";
import PageTitle from "@/components/Titles/PageTitle";

export default function Clients() {

  return (
    <div>
      <PageTitle pageTitle={'Clients'} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 0' }}>
        <CreateClientModal />
      </div>
      <ClientsTable />
    </div>
  );
}
