"use strict";

(function exposeNumerologyEngine(global) {
  const rules = global.JOHARI_RULES;

  if (!rules) {
    throw new Error("johari-rules.js must load before numerology-engine.js");
  }

  function reduceNumber(value) {
    let number = Math.abs(Number.parseInt(value, 10) || 0);

    while (number > 9) {
      number = String(number)
        .split("")
        .reduce((sum, digit) => sum + Number(digit), 0);
    }

    return number;
  }

  function parseIsoDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return null;
    }

    return date;
  }

  function formatIsoDate(date) {
    return [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");
  }

  function formatDisplayDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  function getEffectiveDate(dateValue, usePreviousDate) {
    const officialDate = parseIsoDate(dateValue);
    if (!officialDate) return null;

    const effectiveDate = new Date(officialDate.getTime());
    if (usePreviousDate) {
      effectiveDate.setUTCDate(effectiveDate.getUTCDate() - 1);
    }

    return { officialDate, effectiveDate };
  }

  function calculatePsychicNumber(date) {
    return reduceNumber(date.getUTCDate());
  }

  function calculateDestinyNumber(date) {
    const digits = formatIsoDate(date).replace(/-/g, "");
    const total = digits
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
    return reduceNumber(total);
  }

  function calculateName(name) {
    const normalized = String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

    let total = 0;
    let countedLetters = 0;

    for (const character of normalized) {
      if (rules.NAME_VALUES[character]) {
        total += rules.NAME_VALUES[character];
        countedLetters += 1;
      }
    }

    return {
      entered: String(name || "").trim(),
      total,
      number: total ? reduceNumber(total) : null,
      countedLetters,
    };
  }

  function getDirectionalRelation(fromNumber, toNumber) {
    if (!fromNumber || !toNumber) return null;

    if (fromNumber === toNumber) {
      return {
        key: "same",
        label: "Same number",
        gujarati: "સમાન અંક",
      };
    }

    if ((rules.FRIENDS[fromNumber] || []).includes(toNumber)) {
      return {
        key: "friendly",
        label: "Friendly",
        gujarati: "મૈત્રીપૂર્ણ",
      };
    }

    if ((rules.ENEMIES[fromNumber] || []).includes(toNumber)) {
      return {
        key: "unfriendly",
        label: "Unfriendly",
        gujarati: "પ્રતિકૂળ",
      };
    }

    return {
      key: "neutral",
      label: "Neutral",
      gujarati: "તટસ્થ",
    };
  }

  function pairKey(firstNumber, secondNumber) {
    return [firstNumber, secondNumber].sort((a, b) => a - b).join("-");
  }

  function getRoleNote(pairRule, firstPerson, secondPerson) {
    if (!pairRule.roles || !pairRule.roles.length) return null;

    const man =
      firstPerson.gender === "man"
        ? firstPerson
        : secondPerson.gender === "man"
          ? secondPerson
          : null;
    const woman =
      firstPerson.gender === "woman"
        ? firstPerson
        : secondPerson.gender === "woman"
          ? secondPerson
          : null;

    if (!man || !woman) return null;

    return (
      pairRule.roles.find(
        (role) =>
          role.man === man.psychicNumber && role.woman === woman.psychicNumber,
      ) || null
    );
  }

  function getMarriageAssessment(firstPerson, secondPerson) {
    const key = pairKey(firstPerson.psychicNumber, secondPerson.psychicNumber);
    const rule = rules.PAIR_RULES[key];

    if (!rule) {
      throw new Error(`Missing Johari pair rule for ${key}`);
    }

    const roleNote = getRoleNote(rule, firstPerson, secondPerson);
    const statusKey = roleNote?.status || rule.status;

    return {
      key,
      rule,
      roleNote,
      statusKey,
      status: rules.STATUS[statusKey],
    };
  }

  function calculateYearNumber(date, targetYear) {
    const year = Number(targetYear);
    const birthdayInTargetYear = new Date(
      Date.UTC(year, date.getUTCMonth(), date.getUTCDate()),
    );
    const weekday = birthdayInTargetYear.getUTCDay();
    const weekdayValue = rules.WEEKDAY_VALUES[weekday];
    const yearPart = year % 100;
    const total =
      date.getUTCMonth() + 1 + date.getUTCDate() + yearPart + weekdayValue;

    return {
      year,
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      weekday,
      weekdayName: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: "UTC",
      }).format(birthdayInTargetYear),
      weekdayValue,
      yearPart,
      total,
      number: reduceNumber(total),
    };
  }

  function getCompoundDayNote(day) {
    if (day < 10) {
      return {
        en: `The birth day is the single digit ${day}, so no separate compound birth-day note applies.`,
        gu: `જન્મતારીખ એક અંક ${day} છે, તેથી અલગ compound birth-day નોંધ લાગુ પડતી નથી.`,
      };
    }

    return (
      rules.COMPOUND_DAY_NOTES[day] || {
        en: "No separate compound birth-day note is available.",
        gu: "અલગ compound birth-day નોંધ ઉપલબ્ધ નથી.",
      }
    );
  }

  function analyzePerson(input) {
    const dates = getEffectiveDate(
      input.dateOfBirth,
      Boolean(input.usePreviousDate),
    );
    if (!dates) throw new Error("Invalid date of birth");

    const firstName = calculateName(input.firstName);
    const familyName = calculateName(input.familyName);
    const popularName = calculateName(input.popularName);
    const proposedName = calculateName(input.proposedName);
    const psychicNumber = calculatePsychicNumber(dates.effectiveDate);
    const destinyNumber = calculateDestinyNumber(dates.effectiveDate);

    return {
      label: input.label,
      firstName: String(input.firstName || "").trim(),
      familyName: String(input.familyName || "").trim(),
      popularName: String(input.popularName || "").trim(),
      proposedName: String(input.proposedName || "").trim(),
      displayName: String(
        input.popularName || input.firstName || input.label,
      ).trim(),
      gender: input.gender,
      officialDate: dates.officialDate,
      effectiveDate: dates.effectiveDate,
      usePreviousDate: Boolean(input.usePreviousDate),
      psychicNumber,
      psychicPlanet: rules.PLANETS[psychicNumber],
      destinyNumber,
      destinyPlanet: rules.PLANETS[destinyNumber],
      nameNumbers: {
        first: firstName,
        family: familyName,
        popular: popularName,
        proposed: proposedName,
      },
      compoundDay: dates.effectiveDate.getUTCDate(),
      compoundNote: getCompoundDayNote(dates.effectiveDate.getUTCDate()),
    };
  }

  function compareLikeNumbers(firstNumber, secondNumber) {
    if (!firstNumber || !secondNumber) return null;

    return {
      firstToSecond: getDirectionalRelation(firstNumber, secondNumber),
      secondToFirst: getDirectionalRelation(secondNumber, firstNumber),
    };
  }

  function buildFiveYearTimeline(person, startYear) {
    return Array.from({ length: 5 }, (_, index) => {
      const calculation = calculateYearNumber(
        person.effectiveDate,
        Number(startYear) + index,
      );
      return {
        ...calculation,
        theme: rules.YEAR_THEMES[calculation.number],
      };
    });
  }

  global.NumerologyEngine = Object.freeze({
    reduceNumber,
    parseIsoDate,
    formatIsoDate,
    formatDisplayDate,
    getEffectiveDate,
    calculatePsychicNumber,
    calculateDestinyNumber,
    calculateName,
    getDirectionalRelation,
    getMarriageAssessment,
    calculateYearNumber,
    getCompoundDayNote,
    analyzePerson,
    compareLikeNumbers,
    buildFiveYearTimeline,
  });
})(window);
