import FirstSurveillance from "../DashApps/FirstSurveillance"
import Notifications from "../DashApps/Notifications"
import SecondSurveillance from "../DashApps/SecondSurveillance"
import Statastics from "../DashApps/Statistics"
import TodoList from "../DashApps/TodoListApp"
import UpcomingCertifications from "../DashApps/UpcomingCertifications"

export default function DashHome(params) {
  
    return(
        <>
        <div className="container dash-home-container">
        <p className="dash-page-name mb-2">HomePage</p>
        <div className="row">
{/* 
            <div className="col-md-4 mb-4">
            <TodoList />

            </div> */}

<div className="col-md-4 mb-4">
            <FirstSurveillance/>

            </div>

            <div className="col-md-4 mb-4">
            <SecondSurveillance/>

            </div>
            <div className="col-md-4 mb-4">
            <UpcomingCertifications/>

            </div>

            <div className="col-md-4 mb-4">
                <Notifications/>
            </div>
            <div className="col-md-8">
                <Statastics/>
            </div>
        </div>
        </div>
        </>
    )
};
