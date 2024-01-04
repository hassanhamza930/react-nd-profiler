import { useEffect, useState } from "react";
import Header from "../../components/header";
import SurveyCard from "../../components/ui/SurveyCard";
import Dropdown from "../../components/ui/Dropdown";
import { Survey } from "../../Types";
import { getSurveys } from "../../helpers/surveys";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CreateSurvey from "../../components/ui/Modals/Surveys/CreateSurvey";
import { Database } from "../../Types/supabase";

const AdminDashboard = () => {
  const [surveys, setSurveys] =
    useState<Database["public"]["Tables"]["surveys"]["Row"][]>();
  const [filter, setFilter] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    setFilter(
      localStorage.getItem("role")! === "admin"
        ? "child"
        : localStorage.getItem("role")!
    );
  }, []);

  useEffect(() => {
    if (!filter) return;
    console.log("render",render)
    const fetchData = async () => {
      await getSurveys(filter, setSurveys).finally(() => {
        setRender(false);
      });
    };
    fetchData();
  }, [filter, render]);

  return (
    <div>
      <Header heading="Dashboard" />
      <div className="flex justify-between mt-4">
        <p>Welcome Admin!</p>
        <div className="flex items-center">
          <Dropdown setFilter={setFilter} />
          <Button
            className="bg-primary text-sm text-white w-[152px] h-8 md:px-3 px-3 font-normal"
            onClick={() => setIsOpen(true)}
          >
            Create Survey
          </Button>
        </div>
      </div>
      <div className="flex gap-6">
        {surveys?.map((survey, index) => {
          return (
            <div key={index}>
              <SurveyCard survey={survey} setRender={setRender} />
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={isOpen}
        title="Create Survey"
        onChange={() => setIsOpen(false)}
      >
        <CreateSurvey handleClose={() => setIsOpen(false)} setRender={setRender} />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
