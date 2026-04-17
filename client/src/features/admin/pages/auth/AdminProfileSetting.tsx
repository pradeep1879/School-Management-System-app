
import AdminAccountSetting from "../../components/profile/AdminAccountSetting";
import AdminProfileHeader from "../../components/profile/AdminProfileHeader";
import ChangeAdminPasswordCard from "../../components/profile/ChangeAdminPasswordCard";
import { useAdminProfile } from "../../hooks/useAdminProfile";


const AdminProfileSetting = () => {
  const { data } = useAdminProfile()
  console.log(data)
  const admin = data?.admin;


  return (
    <div className="space-y-6 max-w-3xl">

      <AdminProfileHeader admin={admin} />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <AdminAccountSetting admin={admin} />
        <ChangeAdminPasswordCard />
      </div>

    </div>
  )
}

export default AdminProfileSetting