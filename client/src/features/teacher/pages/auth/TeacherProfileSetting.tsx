
import TeacherProfileHeader from "../../components/profile/TeacherProfileHeader"
import TeacherAccountSetting from "../../components/profile/TeacherAccountSetting TeacherAccountSetting"
import ChangeTeacherPasswordCard from "../../components/profile/ChangeTeacherPasswordCard"
import { useTeacherProfile } from "../../hooks/useTeacherProfile"


const TeacherProfileSetting = () => {
  const {data} = useTeacherProfile();
  console.log("teacher profile setting", data)

  const teacher = data?.teacher

  return (
    <div className="space-y-6 max-w-3xl">

      <TeacherProfileHeader teacher={teacher} />

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <TeacherAccountSetting teacher={teacher} />
        <ChangeTeacherPasswordCard />
      </div>

    </div>
  )
}

export default TeacherProfileSetting