
import ProfileHeader from "../components/profile/ProfileHeader"

import ChangePasswordCard from "../components/profile/ChangePasswordCard"
import AccountSettingsCard from "../components/profile/AccountSettingCard"
import { useStudentProfile } from "../hooks/useStudentProfile"

const StudentProfileSettings = () => {

  const { data } = useStudentProfile()

  const student = data?.student

  return (
    <div className="space-y-6 max-w-3xl">

      <ProfileHeader student={student} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccountSettingsCard student={student} />
        <ChangePasswordCard />
      </div>

    </div>
  )
}

export default StudentProfileSettings