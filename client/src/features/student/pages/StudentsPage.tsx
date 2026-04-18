import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddStudentDialog from "../components/forms/AddStudentDialog";
import { useState } from "react";


const StudentsPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Students</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add New Student</Button>
          </DialogTrigger>
          <AddStudentDialog setOpen={setOpen}/>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            <Select>
              {/* class options later */}
            </Select>

            <Select>
              {/* section options later */}
            </Select>

            <Input placeholder="Search by name..." />

            <Button>Search</Button>

          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="custom-scrollbar w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-left">Section</th>
                  <th className="p-3 text-left">Contact</th>
                  <th className="p-3 text-left">Admission Date</th>
                </tr>
              </thead>

              <tbody>
                {/* Static demo rows */}
                <tr className="border-b">
                  <td className="p-3">Ravi Sharma</td>
                  <td className="p-3">10</td>
                  <td className="p-3">A</td>
                  <td className="p-3">9876543210</td>
                  <td className="p-3">12 Jan 2026</td>
                </tr>
              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

      {/* Newly Added */}
      <Card>
        <CardHeader>
          <CardTitle>Newly Added Students</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="space-y-2">
            <li>Rahul Verma - Class 9A</li>
            <li>Anjali Singh - Class 8B</li>
          </ul>
        </CardContent>
      </Card>

    </div>
  );
};

export default StudentsPage;
