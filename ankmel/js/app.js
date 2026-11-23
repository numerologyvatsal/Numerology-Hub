"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const engine = window.NumerologyEngine;
  const rules = window.JOHARI_RULES;

  if (!engine || !rules) {
    throw new Error("Numerology files did not load in the required order.");
  }

  const form = document.getElementById("matchForm");
  const resultsSection = document.getElementById("resultsSection");
  const errorBox = document.getElementById("formError");
  const savePdfButton = document.getElementById("savePdfButton");
  const resetButtons = [
    document.getElementById("resetButton"),
    document.getElementById("bottomResetButton"),
  ];
  const startYearInput = document.getElementById("futureStartYear");
  const dateInputs = [
    document.getElementById("personOneDob"),
    document.getElementById("personTwoDob"),
  ];
  const languageButtons = [...document.querySelectorAll("[data-language]")];
  let reportFileName = "AnkMel-Marriage-Report";
  const STORAGE_KEY = "ankmel-saved-form-v1";
  const SAVED_FIELD_IDS = [
    "personOneFirstName",
    "personOneFamilyName",
    "personOnePopularName",
    "personOneProposedName",
    "personOneDob",
    "personOneGender",
    "personOnePreviousDate",
    "personTwoFirstName",
    "personTwoFamilyName",
    "personTwoPopularName",
    "personTwoProposedName",
    "personTwoDob",
    "personTwoGender",
    "personTwoPreviousDate",
    "futureStartYear",
  ];

  const now = new Date();
  const currentYear = now.getFullYear();
  const todayIso = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  startYearInput.value = String(currentYear);
  dateInputs.forEach((input) => {
    input.max = todayIso;
  });

  function saveFormData() {
    const fields = {};

    SAVED_FIELD_IDS.forEach((id) => {
      const field = document.getElementById(id);
      fields[id] = field.type === "checkbox" ? field.checked : field.value;
    });

    const savedData = {
      fields,
      interpretationLanguage: document.body.dataset.interpretationLanguage || "en",
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
    } catch (error) {
      console.warn("Form data could not be saved in this browser.", error);
    }
  }

  function setInterpretationLanguage(language, saveSelection = true) {
    const selectedLanguage = language === "gu" ? "gu" : "en";
    document.body.dataset.interpretationLanguage = selectedLanguage;

    languageButtons.forEach((button) => {
      const isActive = button.dataset.language === selectedLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (saveSelection) {
      saveFormData();
    }
  }

  function restoreSavedFormData() {
    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (!rawData) return;

      const savedData = JSON.parse(rawData);
      const fields = savedData.fields || {};

      SAVED_FIELD_IDS.forEach((id) => {
        if (!Object.prototype.hasOwnProperty.call(fields, id)) return;

        const field = document.getElementById(id);
        if (field.type === "checkbox") {
          field.checked = Boolean(fields[id]);
        } else {
          field.value = String(fields[id] ?? "");
        }
      });

      setInterpretationLanguage(savedData.interpretationLanguage, false);
    } catch (error) {
      console.warn("Saved form data could not be restored.", error);
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setInterpretationLanguage(button.dataset.language);
    });
  });

  setInterpretationLanguage("en", false);
  restoreSavedFormData();

  form.addEventListener("input", saveFormData);
  form.addEventListener("change", saveFormData);

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function titleCaseName(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/(^|[\s'-])([a-z])/g, (_, separator, letter) => `${separator}${letter.toUpperCase()}`);
  }

  function possessive(name) {
    return /s$/i.test(name) ? `${name}'` : `${name}'s`;
  }

  function getInputValue(id) {
    return document.getElementById(id).value.trim();
  }

  function getPersonInput(prefix, label) {
    return {
      label,
      firstName: titleCaseName(getInputValue(`${prefix}FirstName`)),
      familyName: titleCaseName(getInputValue(`${prefix}FamilyName`)),
      popularName: titleCaseName(getInputValue(`${prefix}PopularName`)),
      proposedName: titleCaseName(getInputValue(`${prefix}ProposedName`)),
      dateOfBirth: getInputValue(`${prefix}Dob`),
      gender: getInputValue(`${prefix}Gender`),
      usePreviousDate: document.getElementById(`${prefix}PreviousDate`).checked,
    };
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultsSection.hidden = true;
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  function validateInputs(first, second, startYear) {
    if (!first.firstName || !first.popularName || !second.firstName || !second.popularName) {
      return "Please enter the First / Calling Name and Popular / Full Name for both people.";
    }

    if (
      engine.calculateName(first.firstName).countedLetters === 0 ||
      engine.calculateName(first.popularName).countedLetters === 0 ||
      engine.calculateName(second.firstName).countedLetters === 0 ||
      engine.calculateName(second.popularName).countedLetters === 0
    ) {
      return "Please enter both names using English letters so the Johari name values can be calculated.";
    }

    const firstDate = engine.parseIsoDate(first.dateOfBirth);
    const secondDate = engine.parseIsoDate(second.dateOfBirth);
    if (!firstDate || !secondDate) {
      return "Please select a valid date of birth for both people.";
    }

    const today = engine.parseIsoDate(todayIso);
    if (firstDate > today || secondDate > today) {
      return "A date of birth cannot be in the future.";
    }

    if (!first.gender || !second.gender) {
      return "Please select Man or Woman as the marriage role for both people.";
    }

    if (first.gender === second.gender) {
      return "Johari's role-specific marriage text used here is written for one Man and one Woman. Please select one of each.";
    }

    if (!Number.isInteger(startYear) || startYear < 1900 || startYear > 2200) {
      return "Please enter a future-reading start year from 1900 to 2200.";
    }

    return "";
  }

  function profileRows(person) {
    const rows = [
      ["Marriage Role", person.gender === "man" ? "Man" : "Woman"],
      ["Official Date of Birth", engine.formatDisplayDate(person.officialDate)],
      ["Psychic Number (Mulank)", person.psychicNumber],
      ["Psychic Planet", person.psychicPlanet],
      ["Destiny Number (Bhagyank)", person.destinyNumber],
      ["Destiny Planet", person.destinyPlanet],
      ["First / Calling Name", `${person.nameNumbers.first.total} → ${person.nameNumbers.first.number}`],
    ];

    if (person.nameNumbers.family.number) {
      rows.push(["Family / Surname", `${person.nameNumbers.family.total} → ${person.nameNumbers.family.number}`]);
    }

    rows.push(["Popular / Full Name", `${person.nameNumbers.popular.total} → ${person.nameNumbers.popular.number}`]);

    if (person.nameNumbers.proposed.number) {
      rows.push(["Proposed Married Name", `${person.nameNumbers.proposed.total} → ${person.nameNumbers.proposed.number}`]);
    }

    return rows;
  }

  function renderProfiles(people) {
    document.getElementById("personProfiles").innerHTML = people
      .map((person, index) => {
        const rows = profileRows(person)
          .map(
            ([label, value]) => `
              <div>
                <dt>${escapeHtml(label)}</dt>
                <dd>${escapeHtml(value)}</dd>
              </div>`,
          )
          .join("");

        const adjustment = person.usePreviousDate
          ? `<p class="date-adjustment-note">Previous date applied: ${escapeHtml(engine.formatDisplayDate(person.effectiveDate))} is used for all birth-number calculations.</p>`
          : "";

        return `
          <article class="profile-card">
            <span class="card-kicker">Person ${index + 1}</span>
            <h3>${escapeHtml(person.displayName)}</h3>
            <dl class="number-details">${rows}</dl>
            ${adjustment}
          </article>`;
      })
      .join("");
  }

  function renderMainAssessment(first, second, assessment) {
    const finalCard = document.getElementById("finalResultCard");
    const status = assessment.status;
    const roleEnglish = assessment.roleNote ? ` ${assessment.roleNote.en}` : "";
    const roleGujarati = assessment.roleNote ? ` ${assessment.roleNote.gu}` : "";

    finalCard.dataset.tone = status.tone;
    document.getElementById("resultStatusBadge").textContent = status.label;
    document.getElementById("resultTitle").textContent = `${first.displayName} & ${second.displayName}: ${status.label}`;
    document.getElementById("resultSummaryEnglish").textContent =
      `${possessive(first.displayName)} Psychic Number (Mulank) is ${first.psychicNumber} and ${possessive(second.displayName)} is ${second.psychicNumber}. ${assessment.rule.en}${roleEnglish}`;
    document.getElementById("resultSummaryGujarati").textContent =
      `${first.displayName}નો મૂળાંક ${first.psychicNumber} અને ${second.displayName}નો મૂળાંક ${second.psychicNumber} છે. ${assessment.rule.gu}${roleGujarati}`;
  }

  function renderPairViews(first, second, assessment) {
    const peopleByNumber = new Map([
      [first.psychicNumber, first.displayName],
      [second.psychicNumber, second.displayName],
    ]);

    document.getElementById("pairViews").innerHTML = assessment.rule.views
      .map((view) => {
        const name = first.psychicNumber === second.psychicNumber
          ? `${first.displayName} & ${second.displayName}`
          : peopleByNumber.get(view.number) || `Number ${view.number}`;

        return `
          <article class="pair-view-card">
            <h3>${escapeHtml(name)} — Number ${view.number} View</h3>
            <p data-language-content="en">${escapeHtml(view.en)}</p>
            <p class="translated-text" data-language-content="gu" lang="gu">${escapeHtml(view.gu)}</p>
          </article>`;
      })
      .join("");

    const roleBox = document.getElementById("roleSpecificNote");
    if (assessment.roleNote) {
      const roleStatus = rules.STATUS[assessment.roleNote.status];
      roleBox.innerHTML = `
        <strong>Selected-Role Reading: ${escapeHtml(roleStatus.label)}</strong>
        <p data-language-content="en">${escapeHtml(assessment.roleNote.en)}</p>
        <p class="translated-text" data-language-content="gu" lang="gu">${escapeHtml(assessment.roleNote.gu)}</p>`;
      roleBox.hidden = false;
    } else {
      roleBox.innerHTML = "";
      roleBox.hidden = true;
    }
  }

  function relationMarkup(relation) {
    return `<strong class="relation-badge relation-${escapeHtml(relation.key)}">${escapeHtml(relation.label)}</strong>`;
  }

  function checkRow(category, first, second, firstNumber, secondNumber, note) {
    const comparison = engine.compareLikeNumbers(firstNumber, secondNumber);
    if (!comparison) return "";

    return `
      <article class="check-row">
        <div class="check-category">
          <strong>${escapeHtml(category)}</strong>
          <small>${escapeHtml(note)}</small>
        </div>
        <div class="direction-result">
          <span>${escapeHtml(first.displayName)} (${firstNumber}) → ${escapeHtml(second.displayName)} (${secondNumber})</span>
          ${relationMarkup(comparison.firstToSecond)}
        </div>
        <div class="direction-result">
          <span>${escapeHtml(second.displayName)} (${secondNumber}) → ${escapeHtml(first.displayName)} (${firstNumber})</span>
          ${relationMarkup(comparison.secondToFirst)}
        </div>
      </article>`;
  }

  function renderLikeCategoryChecks(first, second) {
    const rows = [
      checkRow(
        "Psychic Number",
        first,
        second,
        first.psychicNumber,
        second.psychicNumber,
        "Primary temperament; detailed marriage reading is shown above.",
      ),
      checkRow(
        "Destiny Number",
        first,
        second,
        first.destinyNumber,
        second.destinyNumber,
        "Supporting long-term number relation.",
      ),
      checkRow(
        "First / Calling Name",
        first,
        second,
        first.nameNumbers.first.number,
        second.nameNumbers.first.number,
        "Supporting close and personal name relation.",
      ),
      first.nameNumbers.family.number && second.nameNumbers.family.number
        ? checkRow(
            "Family / Surname",
            first,
            second,
            first.nameNumbers.family.number,
            second.nameNumbers.family.number,
            "Supporting family-name relation.",
          )
        : "",
      checkRow(
        "Popular / Full Name",
        first,
        second,
        first.nameNumbers.popular.number,
        second.nameNumbers.popular.number,
        "Supporting public and normally-used name relation.",
      ),
    ].filter(Boolean);

    document.getElementById("likeCategoryChecks").innerHTML = rows.join("");
  }

  function harmonyLine(label, fromNumber, toNumber) {
    const relation = engine.getDirectionalRelation(fromNumber, toNumber);
    return `
      <div class="harmony-line">
        <span>${escapeHtml(label)} (${fromNumber} → ${toNumber})</span>
        ${relationMarkup(relation)}
      </div>`;
  }

  function renderInternalHarmony(people) {
    document.getElementById("internalHarmony").innerHTML = people
      .map((person, index) => {
        const popular = person.nameNumbers.popular;
        const proposed = person.nameNumbers.proposed;
        const proposedBlock = proposed.number
          ? `
            <p class="harmony-name">Proposed Married Name: ${escapeHtml(person.proposedName)} (${proposed.total} → ${proposed.number})</p>
            <div class="harmony-group">
              ${harmonyLine("Psychic to Proposed Name", person.psychicNumber, proposed.number)}
              ${harmonyLine("Destiny to Proposed Name", person.destinyNumber, proposed.number)}
            </div>`
          : `
            <p class="harmony-name">Proposed Married Name</p>
            <p>No proposed name was entered.</p>`;

        return `
          <article class="harmony-card">
            <span class="card-kicker">Person ${index + 1}</span>
            <h3>${escapeHtml(person.displayName)}</h3>
            <p class="harmony-name">Popular Name: ${escapeHtml(person.popularName)} (${popular.total} → ${popular.number})</p>
            <div class="harmony-group">
              ${harmonyLine("Psychic to Popular Name", person.psychicNumber, popular.number)}
              ${harmonyLine("Destiny to Popular Name", person.destinyNumber, popular.number)}
            </div>
            ${proposedBlock}
          </article>`;
      })
      .join("");
  }

  function renderCompoundNotes(people) {
    document.getElementById("compoundNotes").innerHTML = people
      .map(
        (person, index) => `
          <article class="compound-card">
            <span class="card-kicker">Person ${index + 1}</span>
            <span class="compound-day">${person.compoundDay}</span>
            <h3>${escapeHtml(person.displayName)}</h3>
            <p data-language-content="en">${escapeHtml(person.compoundNote.en)}</p>
            <p class="translated-text" data-language-content="gu" lang="gu">${escapeHtml(person.compoundNote.gu)}</p>
          </article>`,
      )
      .join("");
  }

  function renderFutureTimeline(people, startYear) {
    document.getElementById("futureTimeline").innerHTML = people
      .map((person, index) => {
        const years = engine
          .buildFiveYearTimeline(person, startYear)
          .map(
            (year) => `
              <article class="year-card">
                <div class="year-card-header">
                  <strong>${year.year}</strong>
                  <span class="year-number" title="Year Number ${year.number}">${year.number}</span>
                </div>
                <h4 data-language-content="en">${escapeHtml(year.theme.title)}</h4>
                <h4 class="translated-text" data-language-content="gu" lang="gu">${escapeHtml(year.theme.guTitle)}</h4>
                <p data-language-content="en">${escapeHtml(year.theme.en)}</p>
                <p class="translated-text" data-language-content="gu" lang="gu">${escapeHtml(year.theme.gu)}</p>
                <p class="year-formula">${year.month} + ${year.day} + ${year.yearPart} + ${year.weekdayValue} (${escapeHtml(year.weekdayName)}) = ${year.total} → ${year.number}</p>
              </article>`,
          )
          .join("");

        return `
          <article class="future-person-card">
            <span class="card-kicker">Person ${index + 1}</span>
            <h3>${escapeHtml(person.displayName)}</h3>
            <div class="timeline-grid">${years}</div>
          </article>`;
      })
      .join("");
  }

  function renderResults(first, second, startYear) {
    const assessment = engine.getMarriageAssessment(first, second);
    const safeFirstName = first.displayName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    const safeSecondName = second.displayName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    reportFileName = `AnkMel-${safeFirstName}-${safeSecondName}-Marriage-Report`;
    renderMainAssessment(first, second, assessment);
    renderProfiles([first, second]);
    renderPairViews(first, second, assessment);
    renderLikeCategoryChecks(first, second);
    renderInternalHarmony([first, second]);
    renderCompoundNotes([first, second]);
    renderFutureTimeline([first, second], startYear);
    resultsSection.hidden = false;

    window.requestAnimationFrame(() => {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const firstInput = getPersonInput("personOne", "Person One");
    const secondInput = getPersonInput("personTwo", "Person Two");
    const startYear = Number.parseInt(startYearInput.value, 10);
    const validationMessage = validateInputs(firstInput, secondInput, startYear);

    if (validationMessage) {
      showError(validationMessage);
      return;
    }

    try {
      const firstPerson = engine.analyzePerson(firstInput);
      const secondPerson = engine.analyzePerson(secondInput);
      saveFormData();
      renderResults(firstPerson, secondPerson, startYear);
    } catch (error) {
      console.error(error);
      showError("The calculation could not be completed. Please check the entered details and try again.");
    }
  });

  savePdfButton.addEventListener("click", () => {
    if (resultsSection.hidden) return;

    const originalTitle = document.title;
    document.title = reportFileName;
    window.print();
    document.title = originalTitle;
  });

  function resetAll() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Saved form data could not be cleared.", error);
    }

    form.reset();
    startYearInput.value = String(currentYear);
    setInterpretationLanguage("en", false);
    clearError();
    resultsSection.hidden = true;
    document.getElementById("personOneFirstName").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  resetButtons.forEach((button) => {
    button.addEventListener("click", resetAll);
  });

  if (window.navigator && "serviceWorker" in window.navigator && window.location.protocol !== "file:") {
    window.navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Offline mode could not be enabled.", error);
    });
  }
});
