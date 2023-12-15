import React from "react";
import Header from "../components/header";
import Table from "../components/ui/Table";

const page = async () => {
  return (
    <div>
      <Header heading="Recommendations" />
      <Table />
    </div>
  );
};

export default page;
