import { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/lib/api";

function App() {
  const [totalspent, setTotalspent] = useState(0);
  useEffect(()=>{
    async function fetchTotal() {
      const res=await api.expenses["total-spent"].$get()
      const data=await res.json()
      setTotalspent(data.total)
    }
    fetchTotal()
  },[])
  
  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total spend</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{totalspent}</CardContent>
    </Card>
  );
}

export default App;
