import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

interface Props {
  student: any
}

const WelcomeCard = ({ student }: Props) => {
  return (
    <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <CardContent className="flex items-center gap-5 p-6">
        
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={student?.imageUrl} />
          <AvatarFallback>
            {student?.studentName?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-2xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="text-lg opacity-90">
            {student?.studentName}
          </p>

          <p className="text-sm opacity-80">
            Roll No: {student?.rollNumber}
          </p>
        </div>

        <Button
          asChild
          variant="secondary"
          className="ml-auto shrink-0 gap-2 text-slate-900"
        >
          <Link to="/student/ai-quiz">
            <Sparkles className="h-4 w-4" />
            Take AI Quiz
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default WelcomeCard
