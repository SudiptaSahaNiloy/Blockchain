import { useEffect, useState } from "react";
import React from 'react'
import axios from "axios";

function Verify() {
  const [backendData, setbackendData] = useState({});

  useEffect(() => {
    axios.post('/api', { "name": "Niloy" })
      .then(res => {
        console.log(res.data);
      })

  }, []);

  return (
    <div>
      verify
    </div>
  )
}

export default Verify