import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [classification, setClassification] = useState("Not enough credits entered");
  const [modules, setModules] = useState([]);

  /**
   * @param {any[]} modules List of modules
   * @returns 
   */
  function updateModules(modules) {
    setModules(modules);
    const lvl2Creds = modules.filter(m => m.level == 2).reduce((prev, module) => prev + module.credits, 0);
    const lvl3Creds = modules.filter(m => m.level == 3).reduce((prev, module) => prev + module.credits, 0);
    if (lvl2Creds < 120 || lvl3Creds < 120) {
      setClassification("Not enough credits entered");
      return;
    }
    const toplvl2Modules = getTop120Credits(modules.filter(m => m.level == 2));
    const toplvl3Modules = getTop120Credits(modules.filter(m => m.level == 3));
    let moduleScore = 0;
    for (const module of toplvl2Modules) {
      moduleScore += module.grade * module.credits;
    }
    for (const module of toplvl3Modules) {
      moduleScore += (module.grade * module.credits) * 2;
    }
    if (moduleScore <= 630 || (moduleScore <= 690 && testBorderline(toplvl3Modules, 1))) {
      setClassification("First Class");
    } else if (moduleScore <= 900 || (moduleScore <= 960 && testBorderline(toplvl3Modules, 2))) {
      setClassification("Upper Second Class (2:1)");
    } else if (moduleScore <= 1170 || (moduleScore <= 1230 && testBorderline(toplvl3Modules, 3))) {
      setClassification("Lower Second Class (2:2)");
    } else {
      setClassification("Third Class");
    }
  }

  /**
   * @param {any[]} m List of module objects.
   * @returns {any[]} List of modules sorted by grade summing to 120 credits.
   */
  function getTop120Credits(m) {
    m.sort((a, b) => (a.grade - b.grade));
    let credits = 0;
    const topModules = [];
    while (credits < 120) {
      const module = m.shift();
      topModules.push(module);
      credits += module.credits;
    }
    return topModules;
  }

  /**
   * @param {any[]} modules List of Level 3 modules and grades
   * @param {Number} minimumGrade Minimum grade required to apply to borderline test.
   * @returns {boolean} Whether student has enough credits (60) at `minimumGrade`.
   */
  function testBorderline(modules, minimumGrade) {
    let creditsAtMinGrade = 0;
    for (const module of modules) {
      if (module.grade <= minimumGrade) {
        creditsAtMinGrade += module.credits;
      }
    }
    return creditsAtMinGrade >= 60;
  }

  return (
    <div className="container p-3">
      <div className="row text-center mb-2">
        <h1>Open University Degree Classification Calculator</h1>
      </div>
      <div className="row text-center">
        <p>Add all of your level 2 and level 3 modules below.</p>
        <p>Level 1 modules do not count towards your final classification.</p>
      </div>
      <div className="row mb-3">
        <form className="border border-primary-subtle rounded pt-2" onSubmit={(e) => {
          e.preventDefault();
          const newModules = [...modules, {
            key: crypto.randomUUID(),
            name: e.target.name.value,
            level: parseInt(e.target.level.value),
            grade: parseInt(e.target.grade.value),
            credits: parseInt(e.target.credits.value)
          }];
          updateModules(newModules);
        }}>
          <div className="row mb-2">
            <div className="col-md">
              <label htmlFor="moduleNameInput" className="form-label">
                Module name:
              </label>
              <input name='name' type="text" className="form-control" id="moduleNameInput" />
            </div>
            <div className="col-md">
              <label htmlFor="moduleLevelSelect" className="form-label">
                Level:
              </label>
              <select name='level' className="form-select" id="moduleLevelSelect">
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div className="col-md">
              <label htmlFor="creditsSelect" className="form-label">
                Credits:
              </label>
              <select name='credits' className="form-select" id="creditsSelect">
                <option value={30}>30</option>
                <option value={60}>60</option>
              </select>
            </div>
            <div className="col-md">
              <label htmlFor="moduleGradeSelect" className="form-label">
                Grade:
              </label>
              <select name='grade' className="form-select" id="moduleGradeSelect">
                <option value={1}>Distinction</option>
                <option value={2}>Grade 2 Pass</option>
                <option value={3}>Grade 3 Pass</option>
                <option value={4}>Grade 4 Pass</option>
              </select>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col text-center">
              <button type="submit" className="btn btn-primary m-2">
                Add module
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="row justify-content-center">
        <p className="h3 text-center border border-success-subtle rounded w-auto py-2 px-3">
          {classification}
        </p>
      </div>
      <div className="row mb-3">
        <div className="table-responsive px-0 mt-2">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th className="col-2 text-end" scope="col">
                  Level
                </th>
                <th className="col-2 text-end" scope="col">
                  Credits
                </th>
                <th className="col-2 text-end" scope="col">
                  Grade
                </th>
                <th className="col-2 text-end" scope="col" />
              </tr>
            </thead>
            <tbody>
              {modules.map(module => (
                <tr key={module.key}>
                  <td>{module.name}</td>
                  <td className="text-end">{module.level}</td>
                  <td className="text-end">{module.credits}</td>
                  <td className="text-end">{module.grade}</td>
                  <td className="text-end">
                    <button className="btn btn-outline-danger" onClick={() => {
                      const newModules = modules.filter(m => m.key !== module.key);
                      updateModules(newModules);
                    }}>
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer>
        <div className='row'>
          <p className="text-center">
            This application was developed independently and is not affiliated with
            the Open University.
          </p>
        </div>
        <div className='row'>
          <p className='text-center'>
            Read the source code <a href='https://github.com/RyanHx/ou-calculator' target='_blank'>here</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
