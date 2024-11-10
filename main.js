function moduleSubmit(event) {
    const tableBody = document.querySelector("#modulesTable tbody");
    const html =
        `<tr>
        <td>${event.target[0].value}</td>
        <td class="text-end">${event.target[1].value}</td>
        <td class="text-end">${event.target[2].value}</td>
        <td class="text-end">${event.target[3].value}</td>
        <td class="text-end"><button class="btn btn-outline-danger" onclick="removeModule(this)">X</button></td>
    </tr>`;
    tableBody.insertAdjacentHTML('beforeend', html);
    updateClassification();
    event.preventDefault();
}

function removeModule(removeBtn) {
    removeBtn.closest('tr').remove();
    updateClassification();
}

function updateClassification() {
    const classElement = document.getElementById("classification")
    const classification = calculateClass();
    switch (classification) {
        case 1:
            classElement.textContent = "First Class";
            break;
        case 2:
            classElement.textContent = "Upper Second Class (2:1)";
            break;
        case 3:
            classElement.textContent = "Lower Second Class (2:2)";
            break;
        case 4:
            classElement.textContent = "Third Class";
            break;
        default:
            classElement.textContent = "Not enough credits entered"
            break;
    }
}

function calculateClass() {
    let lvl2CredsNeeded = 120,
        lvl3CredsNeeded = 120,
        lvl2Modules = [],
        lvl3Modules = [];
    const submittedModules = document.querySelectorAll("#modulesTable tbody tr");
    console.log(submittedModules);
    for (const moduleData of submittedModules) {
        const module = {
            level: Number.parseInt(moduleData.children[1].textContent),
            grade: Number.parseInt(moduleData.children[2].textContent),
            credits: Number.parseInt(moduleData.children[3].textContent)
        }
        if (module.level === 2) {
            lvl2CredsNeeded -= module.credits;
            lvl2Modules.push(module);
        } else {
            lvl3CredsNeeded -= module.credits;
            lvl3Modules.push(module);
        }
    }
    if (lvl2CredsNeeded > 0 || lvl3CredsNeeded > 0) {
        return -1;
    }
    lvl2Modules = getTop120Credits(lvl2Modules);
    lvl3Modules = getTop120Credits(lvl3Modules);
    let moduleScore = 0;
    for (const module of lvl2Modules) {
        moduleScore += module.grade * module.credits;
    }
    for (const module of lvl3Modules) {
        moduleScore += (module.grade * module.credits) * 2;
    }
    if (moduleScore <= 630 || (moduleScore <= 690 && testBorderline(lvl3Modules, 1))) {
        return 1;
    } else if (moduleScore <= 900 || (moduleScore <= 960 && testBorderline(lvl3Modules, 2))) {
        return 2;
    } else if (moduleScore <= 1170 || (moduleScore <= 1230 && testBorderline(lvl3Modules, 3))) {
        return 3;
    } else {
        return 4;
    }
}

/**
 * 
 * @param {any[]} modules List of module objects.
 * @returns {any[]} List of modules sorted by grade summing to 120 credits.
 */
function getTop120Credits(modules) {
    modules.sort((a, b) => (a.grade - b.grade));
    let credits = 0;
    const topModules = [];
    while (credits < 120) {
        const module = modules.shift();
        topModules.push(module);
        credits += module.credits;
    }
    return topModules;
}

/**
 * 
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

const form = document.getElementById("moduleForm");
form.addEventListener("submit", moduleSubmit);
