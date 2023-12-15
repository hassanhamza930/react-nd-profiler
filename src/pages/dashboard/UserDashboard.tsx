import { useEffect, useState } from "react";
import Header from "../../components/header";
import SurveyCard from "../../components/ui/SurveyCard";
import { Survey } from "../../Types";
import { getSurveys } from "../../helpers/surveys";
import Modal from "../../components/ui/Modal";
import CreateSurvey from "../../components/ui/Modals/Surveys/CreateSurvey";

const UserDashboard = () => {
  const [surveys, setSurveys] = useState<Array<Survey>>();
  const [filter, setFilter] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilter(
      localStorage.getItem("role")! === "admin"
        ? "child"
        : localStorage.getItem("role")!
    );
  }, []);

  useEffect(() => {
    if (!filter) return;
    setLoading(true);
    const fetchData = async () => {
      await getSurveys(filter, setSurveys).finally(() => {
        setLoading(false);
      });
    };
    fetchData();
  }, [filter]);

  return (
    <>
      <Header heading="Dashboard" />
      <div className="flex justify-between mt-4">
        <p>Welcome User!</p>
      </div>
      <div className="flex gap-6">
        {!loading &&
          surveys?.map((survey, index) => {
            return (
              <div key={index}>
                <SurveyCard survey={survey} />
              </div>
            );
          })}
      </div>
      <Modal
        isOpen={isOpen}
        title="Create Survey"
        onChange={() => setIsOpen(false)}
      >
        <CreateSurvey handleClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};

export default UserDashboard;
