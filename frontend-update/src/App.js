import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';

const loggedIn = false;

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Switch>
          <Route path='/'>
            {
              loggedIn ? <Dashboard /> : <LandingPage />
            }
          </Route>
        </Switch>
      </DashboardLayout>
    </Router>
  );
}

export default App;
