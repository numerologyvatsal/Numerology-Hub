"use strict";

/*
 * AnkMel rule data
 * Source method: Harish Johari, Numerology: With Tantra, Ayurveda, and Astrology.
 * This file intentionally contains no Lo Shu, Pythagorean, astrology matching,
 * percentage score, or invented compatibility points.
 */

(function exposeJohariRules(global) {
  const PLANETS = Object.freeze({
    1: "Sun",
    2: "Moon",
    3: "Jupiter",
    4: "Rahu",
    5: "Mercury",
    6: "Venus",
    7: "Ketu",
    8: "Saturn",
    9: "Mars",
  });

  const NAME_VALUES = Object.freeze({
    A: 1,
    I: 1,
    J: 1,
    Q: 1,
    Y: 1,
    B: 2,
    C: 2,
    K: 2,
    R: 2,
    G: 3,
    L: 3,
    S: 3,
    D: 4,
    M: 4,
    T: 4,
    E: 5,
    N: 5,
    U: 6,
    V: 6,
    W: 6,
    X: 6,
    O: 7,
    Z: 7,
    F: 8,
    H: 8,
    P: 8,
  });

  // Directional planetary relationships printed in Johari's relationship table.
  const FRIENDS = Object.freeze({
    1: [2, 3, 9],
    2: [1, 3],
    3: [1, 2, 9],
    4: [5, 6, 8],
    5: [1, 4, 6],
    6: [4, 5, 8],
    7: [5, 6, 8],
    8: [4, 5, 6],
    9: [1, 2, 3],
  });

  const ENEMIES = Object.freeze({
    1: [4, 6, 8],
    2: [4, 5],
    3: [5, 6],
    4: [1, 2, 9],
    5: [2],
    6: [1, 2],
    7: [1, 2, 9],
    8: [1, 2, 9],
    9: [4, 5],
  });

  const STATUS = Object.freeze({
    favourable: {
      label: "Favourable Marriage Combination",
      gujarati: "અનુકૂળ લગ્ન સંયોજન",
      tone: "positive",
    },
    conditional: {
      label: "Conditional / Role-Dependent Combination",
      gujarati: "શરતી / સ્ત્રી-પુરુષ ભૂમિકા આધારિત સંયોજન",
      tone: "conditional",
    },
    challenging: {
      label: "Challenging Marriage Combination",
      gujarati: "પડકારજનક લગ્ન સંયોજન",
      tone: "challenging",
    },
    notRecommended: {
      label: "Not Recommended in Johari's Text",
      gujarati: "Johariના લખાણમાં ભલામણ કરાયેલ નથી",
      tone: "negative",
    },
  });

  /*
   * Each key is the two numbers in ascending order. The two `views` preserve
   * Johari's directional chapters instead of hiding their asymmetry. Role notes
   * are applied only when the selected Man/Woman roles match the stated numbers.
   */
  const PAIR_RULES = Object.freeze({
    "1-1": {
      status: "challenging",
      en: "The two people are similar and compatible in temperament, but Johari says the sameness gives little mutual growth and is not ideal for a long marriage.",
      gu: "બંનેનો સ્વભાવ સમાન અને સુસંગત હોઈ શકે છે, પરંતુ Johari મુજબ આ સમાનતા પરસ્પર વિકાસ ઓછો કરે છે અને લાંબા લગ્ન માટે આદર્શ નથી.",
      views: [
        {
          number: 1,
          en: "Number 1 sees another 1 as similar, but not a relationship that adds much growth.",
          gu: "મૂલાંક 1 બીજા 1ને સમાન માને છે, પરંતુ સંબંધમાં ખાસ વિકાસ ઉમેરાતો નથી.",
        },
      ],
    },
    "1-2": {
      status: "notRecommended",
      en: "Johari does not describe 1 and 2 as an ideal married pair. Number 1 tends to dominate, while 2 gives more support than it receives.",
      gu: "Johari 1 અને 2ને આદર્શ લગ્નજોડું માનતા નથી. 1નું પ્રભુત્વ રહેવાની અને 2 તરફથી વધુ સહકાર મળવાની શક્યતા બતાવાય છે.",
      views: [
        {
          number: 1,
          en: "Number 2 can support 1, but the bond may become unequal.",
          gu: "2, 1ને સહકાર આપી શકે છે, પરંતુ સંબંધ અસમાન બની શકે છે.",
        },
        {
          number: 2,
          en: "Number 1 may dominate 2, so marriage is not presented as ideal.",
          gu: "1નું 2 પર પ્રભુત્વ રહી શકે છે, તેથી લગ્ન આદર્શ ગણાવ્યા નથી.",
        },
      ],
    },
    "1-3": {
      status: "conditional",
      en: "This pair is favourable in some roles but Johari's two chapters are not equally positive. The selected marriage roles matter.",
      gu: "કેટલીક સ્ત્રી-પુરુષ ભૂમિકામાં આ જોડું અનુકૂળ છે, પરંતુ Johariના બંને અધ્યાય સમાન રીતે સકારાત્મક નથી. પસંદ કરેલી ભૂમિકા મહત્વની છે.",
      views: [
        {
          number: 1,
          en: "Number 3 is helpful to 1, though the 1 chapter does not call 3 an ideal life partner.",
          gu: "3, 1ને મદદરૂપ છે, છતાં 1ના અધ્યાયમાં 3ને આદર્શ જીવનસાથી ગણાવ્યો નથી.",
        },
        {
          number: 3,
          en: "The 3 chapter describes marriage with 1 as mutually beneficial in the favourable role arrangement.",
          gu: "3ના અધ્યાયમાં અનુકૂળ ભૂમિકામાં 1 સાથેનું લગ્ન પરસ્પર લાભદાયક ગણાવ્યું છે.",
        },
      ],
      roles: [
        {
          man: 1,
          woman: 3,
          status: "favourable",
          en: "Johari specifically presents a Number 1 man with a Number 3 woman as an ideal, mutually beneficial arrangement.",
          gu: "Johari ખાસ કરીને મૂળાંક 1 પુરુષ અને મૂળાંક 3 સ્ત્રીનું જોડાણ આદર્શ અને પરસ્પર લાભદાયક બતાવે છે.",
        },
        {
          man: 3,
          woman: 1,
          status: "conditional",
          en: "The reverse role is not given the same clear recommendation in the text.",
          gu: "ઉલટી ભૂમિકાને પુસ્તકમાં એટલી સ્પષ્ટ ભલામણ આપવામાં આવી નથી.",
        },
      ],
    },
    "1-4": {
      status: "conditional",
      en: "The attraction can be strong, but the benefit is described as unequal: 4 may gain more from 1 than 1 gains from 4.",
      gu: "આકર્ષણ મજબૂત હોઈ શકે છે, પરંતુ લાભ અસમાન બતાવાયો છે: 4ને 1થી વધુ લાભ મળી શકે છે.",
      views: [
        {
          number: 1,
          en: "The 1 chapter warns that 4 benefits more and the match may not benefit 1.",
          gu: "1ના અધ્યાયમાં કહેવામાં આવ્યું છે કે 4ને વધુ લાભ થાય છે અને જોડાણ 1 માટે ખાસ લાભદાયક ન હોઈ શકે.",
        },
        {
          number: 4,
          en: "The 4 chapter says 1 can be a good and fortunate life partner for 4.",
          gu: "4ના અધ્યાયમાં 1ને 4 માટે સારો અને ભાગ્યશાળી જીવનસાથી ગણાવ્યો છે.",
        },
      ],
    },
    "1-5": {
      status: "conditional",
      en: "Numbers 1 and 5 are friendly, but Johari does not give an unconditional life-partner recommendation. Gender roles change the reading.",
      gu: "1 અને 5 મૈત્રીપૂર્ણ છે, પરંતુ Johari જીવનસાથી તરીકે નિશર્ત ભલામણ આપતા નથી. સ્ત્રી-પુરુષ ભૂમિકા પ્રમાણે અર્થ બદલાય છે.",
      views: [
        {
          number: 1,
          en: "The bond is friendly, yet not presented as an ideal life partnership.",
          gu: "સંબંધ મૈત્રીપૂર્ણ છે, છતાં આદર્શ જીવનસાથીનું જોડાણ ગણાવ્યું નથી.",
        },
        {
          number: 5,
          en: "The 5 chapter allows the pairing in one role arrangement and discourages the reverse.",
          gu: "5ના અધ્યાયમાં એક ભૂમિકા અનુકૂળ અને ઉલટી ભૂમિકા પ્રતિકૂળ બતાવવામાં આવી છે.",
        },
      ],
      roles: [
        {
          man: 5,
          woman: 1,
          status: "favourable",
          en: "A Number 5 man with a Number 1 woman is described as workable.",
          gu: "મૂલાંક 5 પુરુષ અને મૂળાંક 1 સ્ત્રીનું જોડાણ ચાલે એવું દર્શાવ્યું છે.",
        },
        {
          man: 1,
          woman: 5,
          status: "notRecommended",
          en: "Johari advises against a Number 1 man marrying a Number 5 woman.",
          gu: "Johari મૂળાંક 1 પુરુષને મૂળાંક 5 સ્ત્રી સાથે લગ્ન ન કરવાની સલાહ આપે છે.",
        },
      ],
    },
    "1-6": {
      status: "notRecommended",
      en: "Johari does not present 1 and 6 as ideal life partners and notes communication or suitability problems in both role arrangements.",
      gu: "Johari 1 અને 6ને આદર્શ જીવનસાથી માનતા નથી અને બંને ભૂમિકામાં સંવાદ અથવા યોગ્યતાની મુશ્કેલી બતાવે છે.",
      views: [
        {
          number: 1,
          en: "The 1 chapter does not recommend 6 as an ideal life partner.",
          gu: "1ના અધ્યાયમાં 6ને આદર્શ જીવનસાથી તરીકે ભલામણ નથી.",
        },
        {
          number: 6,
          en: "The 6 chapter also describes the pairing as unsuitable for marriage.",
          gu: "6ના અધ્યાયમાં પણ આ જોડાણ લગ્ન માટે યોગ્ય ગણાવ્યું નથી.",
        },
      ],
    },
    "1-7": {
      status: "conditional",
      en: "This pair can have attraction and romance, but practical differences and marriage roles strongly affect the outcome described by Johari.",
      gu: "આ જોડામાં આકર્ષણ અને રોમાન્સ હોઈ શકે છે, પરંતુ વ્યવહારિક તફાવતો અને ભૂમિકાઓ Johariના અર્થઘટનમાં ખૂબ મહત્વ ધરાવે છે.",
      views: [
        {
          number: 1,
          en: "Attraction is possible, but differences in working style can create strain.",
          gu: "આકર્ષણ શક્ય છે, પરંતુ કાર્યપદ્ધતિના તફાવતથી તણાવ થઈ શકે છે.",
        },
        {
          number: 7,
          en: "The 7 chapter supports one role arrangement and warns about the reverse unless behaviour changes.",
          gu: "7ના અધ્યાયમાં એક ભૂમિકા અનુકૂળ છે અને વર્તન ન બદલાય તો ઉલટી ભૂમિકામાં ચેતવણી છે.",
        },
      ],
      roles: [
        {
          man: 1,
          woman: 7,
          status: "favourable",
          en: "A Number 1 man with a Number 7 woman is the more favourable arrangement in the 7 chapter.",
          gu: "7ના અધ્યાય મુજબ મૂળાંક 1 પુરુષ અને મૂળાંક 7 સ્ત્રીનું જોડાણ વધુ અનુકૂળ છે.",
        },
        {
          man: 7,
          woman: 1,
          status: "challenging",
          en: "The reverse arrangement needs behavioural adjustment and is not presented as naturally easy.",
          gu: "ઉલટી ભૂમિકામાં વર્તનમાં ફેરફાર જરૂરી છે અને સંબંધ સ્વાભાવિક રીતે સરળ ગણાવ્યો નથી.",
        },
      ],
    },
    "1-8": {
      status: "conditional",
      en: "Johari treats 1 and 8 as opposites. Attraction may occur, but marriage is described as difficult or only temporarily fortunate.",
      gu: "Johari 1 અને 8ને વિરોધી સ્વભાવવાળા ગણે છે. આકર્ષણ થઈ શકે, પરંતુ લગ્ન મુશ્કેલ અથવા થોડા સમય માટે જ અનુકૂળ ગણાવ્યા છે.",
      views: [
        {
          number: 1,
          en: "The 1 chapter warns against expecting stable long-term benefit from this opposite pairing.",
          gu: "1ના અધ્યાયમાં આ વિરોધી જોડાથી સ્થિર લાંબા ગાળાના લાભની અપેક્ષા ન રાખવાની ચેતવણી છે.",
        },
        {
          number: 8,
          en: "The 8 chapter also gives only limited, role-dependent support.",
          gu: "8ના અધ્યાયમાં પણ મર્યાદિત અને ભૂમિકા આધારિત અનુકૂળતા બતાવાય છે.",
        },
      ],
      roles: [
        {
          man: 8,
          woman: 1,
          status: "notRecommended",
          en: "Johari advises a Number 1 woman not to marry a Number 8 man.",
          gu: "Johari મૂળાંક 1 સ્ત્રીને મૂળાંક 8 પુરુષ સાથે લગ્ન ન કરવાની સલાહ આપે છે.",
        },
        {
          man: 1,
          woman: 8,
          status: "conditional",
          en: "A Number 8 woman with a Number 1 man may feel fortunate at first, but the text does not promise permanence.",
          gu: "મૂલાંક 8 સ્ત્રી અને મૂળાંક 1 પુરુષનું જોડાણ શરૂઆતમાં ભાગ્યશાળી લાગે, પરંતુ પુસ્તક સ્થાયિત્વની ખાતરી આપતું નથી.",
        },
      ],
    },
    "1-9": {
      status: "conditional",
      en: "Johari's Number 1 and Number 9 chapters give conflicting role guidance for this pair, so the book does not provide one consistent marriage verdict.",
      gu: "Johariના મૂળાંક 1 અને મૂળાંક 9ના અધ્યાયોમાં આ જોડા માટે ભૂમિકા અંગે વિરોધાભાસ છે, તેથી પુસ્તક એકસરખો લગ્નનિર્ણય આપતું નથી.",
      views: [
        {
          number: 1,
          en: "The 1 chapter favours a Number 9 man with a Number 1 woman and warns about the reverse.",
          gu: "1ના અધ્યાયમાં મૂળાંક 9 પુરુષ અને મૂળાંક 1 સ્ત્રીને અનુકૂળ અને ઉલટા જોડાને પ્રતિકૂળ ગણાવ્યું છે.",
        },
        {
          number: 9,
          en: "The 9 chapter gives the opposite recommendation, favouring a Number 1 man with a Number 9 woman.",
          gu: "9ના અધ્યાયમાં ઉલટી ભલામણ છે—મૂલાંક 1 પુરુષ અને મૂળાંક 9 સ્ત્રીને અનુકૂળ ગણાવ્યું છે.",
        },
      ],
    },
    "2-2": {
      status: "notRecommended",
      en: "Johari does not recommend two Number 2 people for marriage and describes instability or separation as a risk.",
      gu: "Johari બે મૂળાંક 2 લોકોના લગ્નની ભલામણ કરતા નથી અને અસ્થિરતા અથવા અલગાવનું જોખમ બતાવે છે.",
      views: [
        {
          number: 2,
          en: "Two 2s may share sensitivity, but the text does not regard the marriage as stable.",
          gu: "બે 2માં સંવેદનશીલતા સમાન હોઈ શકે, પરંતુ પુસ્તક લગ્નને સ્થિર ગણાવતું નથી.",
        },
      ],
    },
    "2-3": {
      status: "conditional",
      en: "The two directional chapters differ: the 2 chapter is cautious about 3 as a husband, while the 3 chapter describes the marriage as beneficial.",
      gu: "બંને દિશાના અધ્યાયોમાં તફાવત છે: 2નો અધ્યાય 3 પતિ અંગે સાવચેત છે, જ્યારે 3નો અધ્યાય લગ્નને લાભદાયક ગણાવે છે.",
      views: [
        {
          number: 2,
          en: "The 2 chapter does not regard a Number 3 husband as a good choice.",
          gu: "2ના અધ્યાયમાં મૂળાંક 3 પતિને સારો વિકલ્પ ગણાવ્યો નથી.",
        },
        {
          number: 3,
          en: "The 3 chapter says 3 may select 2 for marriage and calls it mutually beneficial.",
          gu: "3ના અધ્યાયમાં 3 માટે 2 સાથે લગ્ન પરસ્પર લાભદાયક ગણાવ્યા છે.",
        },
      ],
      roles: [
        {
          man: 3,
          woman: 2,
          status: "challenging",
          en: "For a Number 3 man with a Number 2 woman, Johari's two chapters do not agree, so this needs caution.",
          gu: "મૂલાંક 3 પુરુષ અને મૂળાંક 2 સ્ત્રી માટે Johariના બંને અધ્યાય સહમત નથી, તેથી સાવચેતી જરૂરી છે.",
        },
      ],
    },
    "2-4": {
      status: "conditional",
      en: "This is an asymmetric pair. One chapter describes later progress in a specific role arrangement, while the other advises Number 4 against choosing 2 for marriage.",
      gu: "આ અસમાન દિશાવાળું જોડું છે. એક અધ્યાય ચોક્કસ ભૂમિકામાં પછીનો વિકાસ બતાવે છે, જ્યારે બીજો 4ને 2 સાથે લગ્ન ન કરવાની સલાહ આપે છે.",
      views: [
        {
          number: 2,
          en: "The 2 chapter says 2 can benefit from 4; a 2 man and 4 woman may improve after early difficulty.",
          gu: "2ના અધ્યાયમાં 2ને 4થી લાભ બતાવ્યો છે; 2 પુરુષ અને 4 સ્ત્રી શરૂઆતની મુશ્કેલી પછી પ્રગતિ કરી શકે છે.",
        },
        {
          number: 4,
          en: "The 4 chapter advises 4 not to select 2 as a life partner.",
          gu: "4ના અધ્યાયમાં 4ને 2 જીવનસાથી તરીકે ન પસંદ કરવાની સલાહ છે.",
        },
      ],
    },
    "2-5": {
      status: "notRecommended",
      en: "Johari describes 2 and 5 as inharmonious for marriage and warns that the relationship may be short-lived.",
      gu: "Johari 2 અને 5ને લગ્ન માટે અસુસંગત ગણે છે અને સંબંધ ટૂંકા સમયનો રહી શકે એવી ચેતવણી આપે છે.",
      views: [
        {
          number: 2,
          en: "Number 5 is not presented as a stable life partner for 2.",
          gu: "5ને 2 માટે સ્થિર જીવનસાથી ગણાવ્યો નથી.",
        },
        {
          number: 5,
          en: "The 5 chapter also treats 2 as an unfavourable relation.",
          gu: "5ના અધ્યાયમાં પણ 2 સાથેનો સંબંધ પ્રતિકૂળ ગણાવ્યો છે.",
        },
      ],
    },
    "2-6": {
      status: "notRecommended",
      en: "The pair can be friendly, but Johari does not regard it as an ideal married partnership, particularly for a Number 2 man with a Number 6 woman.",
      gu: "જોડું મૈત્રીપૂર્ણ હોઈ શકે છે, પરંતુ Johari તેને આદર્શ લગ્નસંબંધ માનતા નથી—ખાસ કરીને મૂળાંક 2 પુરુષ અને મૂળાંક 6 સ્ત્રી માટે.",
      views: [
        {
          number: 2,
          en: "Friendship is possible, but marriage is not recommended as ideal.",
          gu: "મિત્રતા શક્ય છે, પરંતુ લગ્નને આદર્શ ગણાવ્યા નથી.",
        },
        {
          number: 6,
          en: "The 6 chapter also gives no strong marriage support to this pair.",
          gu: "6ના અધ્યાયમાં પણ આ જોડાને મજબૂત લગ્નસમર્થન નથી.",
        },
      ],
    },
    "2-7": {
      status: "notRecommended",
      en: "Number 7 may help Number 2, but Johari does not describe them as good life partners and advises 7 against selecting 2 for marriage.",
      gu: "7, 2ને મદદ કરી શકે છે, પરંતુ Johari બંનેને સારા જીવનસાથી ગણાવતા નથી અને 7ને 2 સાથે લગ્ન ન કરવાની સલાહ આપે છે.",
      views: [
        {
          number: 2,
          en: "Number 2 can receive help from 7, yet the pair is not presented as ideal for marriage.",
          gu: "2ને 7થી મદદ મળી શકે, છતાં લગ્ન માટે જોડું આદર્શ નથી.",
        },
        {
          number: 7,
          en: "The 7 chapter advises against choosing 2 as a life partner.",
          gu: "7ના અધ્યાયમાં 2ને જીવનસાથી તરીકે ન પસંદ કરવાની સલાહ છે.",
        },
      ],
    },
    "2-8": {
      status: "conditional",
      en: "Johari is generally cautious about this pair. One role is specifically discouraged; the reverse is described as less harmful but not strongly recommended.",
      gu: "Johari આ જોડા અંગે સામાન્ય રીતે સાવચેત છે. એક ભૂમિકા ખાસ પ્રતિકૂળ ગણાવાય છે; ઉલટી ભૂમિકા ઓછી હાનિકારક છે, પરંતુ મજબૂત ભલામણ નથી.",
      views: [
        {
          number: 2,
          en: "The 2 chapter distinguishes sharply between the two marriage roles.",
          gu: "2ના અધ્યાયમાં બંને લગ્નભૂમિકાઓ વચ્ચે સ્પષ્ટ તફાવત બતાવ્યો છે.",
        },
        {
          number: 8,
          en: "The 8 chapter does not regard 2 and 8 as good life partners.",
          gu: "8ના અધ્યાયમાં 2 અને 8ને સારા જીવનસાથી ગણાવ્યા નથી.",
        },
      ],
      roles: [
        {
          man: 8,
          woman: 2,
          status: "notRecommended",
          en: "Johari advises a Number 2 woman not to marry a Number 8 man.",
          gu: "Johari મૂળાંક 2 સ્ત્રીને મૂળાંક 8 પુરુષ સાથે લગ્ન ન કરવાની સલાહ આપે છે.",
        },
        {
          man: 2,
          woman: 8,
          status: "conditional",
          en: "A Number 8 woman is described as less harmful to a Number 2 man, but the pairing is not called ideal.",
          gu: "મૂલાંક 8 સ્ત્રીને મૂળાંક 2 પુરુષ માટે ઓછી હાનિકારક ગણાવી છે, પરંતુ જોડાણને આદર્શ નથી કહ્યું.",
        },
      ],
    },
    "2-9": {
      status: "favourable",
      en: "Johari describes 2 and 9 as loving, affectionate, and suitable for marriage, especially a Number 9 man with a Number 2 woman.",
      gu: "Johari 2 અને 9ને પ્રેમાળ, લાગણીસભર અને લગ્ન માટે યોગ્ય ગણે છે—ખાસ કરીને મૂળાંક 9 પુરુષ અને મૂળાંક 2 સ્ત્રીનું જોડાણ.",
      views: [
        {
          number: 2,
          en: "Number 9 gives warmth and support to 2.",
          gu: "9, 2ને ઉષ્મા અને સહકાર આપે છે.",
        },
        {
          number: 9,
          en: "The 9 chapter also supports 2 as a marriage partner.",
          gu: "9ના અધ્યાયમાં પણ 2ને લગ્નસાથી તરીકે સમર્થન છે.",
        },
      ],
    },
    "3-3": {
      status: "favourable",
      en: "Johari describes two Number 3 people as compatible for marriage, friendship, and work.",
      gu: "Johari બે મૂળાંક 3 લોકોને લગ્ન, મિત્રતા અને કાર્ય માટે સુસંગત ગણે છે.",
      views: [
        {
          number: 3,
          en: "Shared Jupiter qualities make this a supportive same-number partnership.",
          gu: "Jupiterના સમાન ગુણો આ સમાન-મૂલાંક જોડાણને સહાયક બનાવે છે.",
        },
      ],
    },
    "3-4": {
      status: "conditional",
      en: "Johari makes the result depend on marriage roles: one arrangement can work, while the reverse is described as unsuccessful.",
      gu: "Johari મુજબ પરિણામ સ્ત્રી-પુરુષ ભૂમિકા પર આધારિત છે: એક જોડાણ ચાલી શકે છે, જ્યારે ઉલટું જોડાણ અસફળ ગણાવ્યું છે.",
      views: [
        {
          number: 3,
          en: "The 3 chapter gives role-specific rather than general approval.",
          gu: "3ના અધ્યાયમાં સામાન્ય નહીં પરંતુ ભૂમિકા આધારિત મંજૂરી છે.",
        },
        {
          number: 4,
          en: "Number 4's changing nature can make the reverse role difficult.",
          gu: "4નો બદલાતો સ્વભાવ ઉલટી ભૂમિકાને મુશ્કેલ બનાવી શકે છે.",
        },
      ],
      roles: [
        {
          man: 3,
          woman: 4,
          status: "favourable",
          en: "A Number 3 man with a Number 4 woman is the workable arrangement described by Johari.",
          gu: "Johari મુજબ મૂળાંક 3 પુરુષ અને મૂળાંક 4 સ્ત્રીનું જોડાણ ચાલે એવું છે.",
        },
        {
          man: 4,
          woman: 3,
          status: "notRecommended",
          en: "The reverse arrangement is described as unsuccessful.",
          gu: "ઉલટું જોડાણ અસફળ ગણાવ્યું છે.",
        },
      ],
    },
    "3-5": {
      status: "conditional",
      en: "This pair is role-dependent in Johari: the 3-man/5-woman arrangement is beneficial, while the reverse is not.",
      gu: "Johari મુજબ આ જોડું ભૂમિકા આધારિત છે: 3 પુરુષ/5 સ્ત્રીનું જોડાણ લાભદાયક અને ઉલટું જોડાણ પ્રતિકૂળ છે.",
      views: [
        {
          number: 3,
          en: "Number 3 can benefit from 5 in the favourable role arrangement.",
          gu: "અનુકૂળ ભૂમિકામાં 3ને 5થી લાભ મળી શકે છે.",
        },
        {
          number: 5,
          en: "The 5 chapter does not make this a universally favourable marriage pair.",
          gu: "5ના અધ્યાયમાં આ જોડાને દરેક ભૂમિકામાં અનુકૂળ ગણાવ્યું નથી.",
        },
      ],
      roles: [
        {
          man: 3,
          woman: 5,
          status: "favourable",
          en: "A Number 3 man with a Number 5 woman is described as beneficial.",
          gu: "મૂલાંક 3 પુરુષ અને મૂળાંક 5 સ્ત્રીનું જોડાણ લાભદાયક ગણાવ્યું છે.",
        },
        {
          man: 5,
          woman: 3,
          status: "notRecommended",
          en: "The reverse arrangement is described as unsuccessful.",
          gu: "ઉલટું જોડાણ અસફળ ગણાવ્યું છે.",
        },
      ],
    },
    "3-6": {
      status: "conditional",
      en: "Johari supports a Number 3 man with a Number 6 woman, but warns against the reverse arrangement.",
      gu: "Johari મૂળાંક 3 પુરુષ અને મૂળાંક 6 સ્ત્રીનું જોડાણ સમર્થિત કરે છે, પરંતુ ઉલટી ભૂમિકા અંગે ચેતવણી આપે છે.",
      views: [
        {
          number: 3,
          en: "The 3 chapter gives a favourable reading only in the stated role arrangement.",
          gu: "3ના અધ્યાયમાં જણાવેલી ભૂમિકામાં જ અનુકૂળ અર્થ છે.",
        },
        {
          number: 6,
          en: "The 6 chapter reinforces the warning for a 6 man with a 3 woman.",
          gu: "6નો અધ્યાય 6 પુરુષ અને 3 સ્ત્રી માટેની ચેતવણીને મજબૂત કરે છે.",
        },
      ],
      roles: [
        {
          man: 3,
          woman: 6,
          status: "favourable",
          en: "A Number 3 man with a Number 6 woman is described as a good pairing.",
          gu: "મૂલાંક 3 પુરુષ અને મૂળાંક 6 સ્ત્રીનું જોડાણ સારું ગણાવ્યું છે.",
        },
        {
          man: 6,
          woman: 3,
          status: "notRecommended",
          en: "Johari advises a Number 6 man to avoid a Number 3 woman as a marriage partner.",
          gu: "Johari મૂળાંક 6 પુરુષને મૂળાંક 3 સ્ત્રીને લગ્નસાથી તરીકે ટાળવાની સલાહ આપે છે.",
        },
      ],
    },
    "3-7": {
      status: "conditional",
      en: "This pair can work well, but Johari describes a smoother result for a Number 3 man with a Number 7 woman; the reverse may begin with difficulties.",
      gu: "આ જોડું સારી રીતે ચાલી શકે છે, પરંતુ Johari 3 પુરુષ/7 સ્ત્રીનું જોડાણ વધુ સરળ બતાવે છે; ઉલટી ભૂમિકામાં શરૂઆતની મુશ્કેલીઓ થઈ શકે છે.",
      views: [
        {
          number: 3,
          en: "Number 7 can support 3's ideas when the partnership is balanced.",
          gu: "સંબંધ સંતુલિત હોય ત્યારે 7, 3ના વિચારોને સહકાર આપી શકે છે.",
        },
        {
          number: 7,
          en: "The 7 chapter allows both roles, but gives a smoother reading to one arrangement.",
          gu: "7નો અધ્યાય બંને ભૂમિકાને શક્ય માને છે, પરંતુ એક જોડાણ વધુ સરળ ગણાવે છે.",
        },
      ],
      roles: [
        {
          man: 3,
          woman: 7,
          status: "favourable",
          en: "A Number 3 man with a Number 7 woman is described as working very well.",
          gu: "મૂલાંક 3 પુરુષ અને મૂળાંક 7 સ્ત્રીનું જોડાણ ખૂબ સારું ચાલે એવું દર્શાવ્યું છે.",
        },
        {
          man: 7,
          woman: 3,
          status: "conditional",
          en: "The reverse may face early difficulty but can improve.",
          gu: "ઉલટી ભૂમિકામાં શરૂઆતની મુશ્કેલી પછી સુધારો થઈ શકે છે.",
        },
      ],
    },
    "3-8": {
      status: "notRecommended",
      en: "Johari does not recommend 3 and 8 as marriage partners and describes their basic approaches as difficult to reconcile.",
      gu: "Johari 3 અને 8ને લગ્નસાથી તરીકે ભલામણ કરતા નથી અને તેમના મૂળભૂત વલણો મેળ બેસાડવા મુશ્કેલ ગણાવે છે.",
      views: [
        {
          number: 3,
          en: "Number 8 is not presented as a favourable life partner for 3.",
          gu: "8ને 3 માટે અનુકૂળ જીવનસાથી ગણાવ્યો નથી.",
        },
        {
          number: 8,
          en: "The 8 chapter also does not give this pair marriage support.",
          gu: "8ના અધ્યાયમાં પણ આ જોડાને લગ્ન માટે સમર્થન નથી.",
        },
      ],
    },
    "3-9": {
      status: "favourable",
      en: "Johari describes 3 and 9 as mutually beneficial and recommends the combination for marriage.",
      gu: "Johari 3 અને 9ને પરસ્પર લાભદાયક ગણે છે અને લગ્ન માટે આ જોડાણની ભલામણ કરે છે.",
      views: [
        {
          number: 3,
          en: "Number 9 supports 3's expansion and activity.",
          gu: "9, 3ના વિકાસ અને પ્રવૃત્તિને સહકાર આપે છે.",
        },
        {
          number: 9,
          en: "Number 3 gives guidance and benefit to 9.",
          gu: "3, 9ને માર્ગદર્શન અને લાભ આપે છે.",
        },
      ],
    },
    "4-4": {
      status: "conditional",
      en: "Johari does not call two Number 4 people an ideal marriage pair, though the relationship may survive under favourable supporting numbers and circumstances.",
      gu: "Johari બે મૂળાંક 4 લોકોને આદર્શ લગ્નજોડું ગણાવતા નથી, જોકે અનુકૂળ સહાયક અંકો અને પરિસ્થિતિમાં સંબંધ ટકી શકે છે.",
      views: [
        {
          number: 4,
          en: "Shared Rahu qualities can intensify sudden change and stubbornness; supporting Destiny and Name Numbers matter.",
          gu: "Rahuના સમાન ગુણો અચાનક ફેરફાર અને હઠ વધારી શકે છે; સહાયક ભાગ્યાંક અને નામંક મહત્વ ધરાવે છે.",
        },
      ],
    },
    "4-5": {
      status: "notRecommended",
      en: "Johari does not recommend 4 and 5 for marriage or business partnership.",
      gu: "Johari 4 અને 5ને લગ્ન અથવા વ્યવસાયિક ભાગીદારી માટે ભલામણ કરતા નથી.",
      views: [
        {
          number: 4,
          en: "The 4 chapter does not see 5 as a stable marriage choice.",
          gu: "4ના અધ્યાયમાં 5ને સ્થિર લગ્નવિકલ્પ ગણાવ્યો નથી.",
        },
        {
          number: 5,
          en: "The 5 chapter also discourages this pair for marriage.",
          gu: "5ના અધ્યાયમાં પણ આ જોડાને લગ્ન માટે પ્રોત્સાહન નથી.",
        },
      ],
    },
    "4-6": {
      status: "conditional",
      en: "Attraction is possible, but Johari warns of long-term dissatisfaction. One role may have a few good years without a promise of permanence.",
      gu: "આકર્ષણ શક્ય છે, પરંતુ Johari લાંબા ગાળાના અસંતોષની ચેતવણી આપે છે. એક ભૂમિકામાં થોડાં સારા વર્ષ હોઈ શકે, પણ સ્થાયિત્વની ખાતરી નથી.",
      views: [
        {
          number: 4,
          en: "Number 4 may be attracted to 6, but the text questions lasting satisfaction.",
          gu: "4ને 6 તરફ આકર્ષણ થઈ શકે, પરંતુ પુસ્તક લાંબા ગાળાના સંતોષ અંગે સવાલ કરે છે.",
        },
        {
          number: 6,
          en: "The 6 chapter is especially cautious for a Number 6 woman with a Number 4 man.",
          gu: "6નો અધ્યાય ખાસ કરીને મૂળાંક 6 સ્ત્રી અને મૂળાંક 4 પુરુષ માટે સાવચેત છે.",
        },
      ],
      roles: [
        {
          man: 4,
          woman: 6,
          status: "challenging",
          en: "Johari says this arrangement may have a few good years but may not remain satisfying.",
          gu: "Johari મુજબ આ જોડાણમાં થોડાં સારા વર્ષ હોઈ શકે છે, પરંતુ સંતોષ કાયમી ન રહી શકે.",
        },
        {
          man: 6,
          woman: 4,
          status: "notRecommended",
          en: "The reverse is not given a favourable marriage recommendation.",
          gu: "ઉલટી ભૂમિકાને અનુકૂળ લગ્નભલામણ આપવામાં આવી નથી.",
        },
      ],
    },
    "4-7": {
      status: "favourable",
      en: "Johari describes 4 and 7 as good life partners, with the 4-man/7-woman arrangement especially favoured.",
      gu: "Johari 4 અને 7ને સારા જીવનસાથી ગણે છે, ખાસ કરીને 4 પુરુષ/7 સ્ત્રીનું જોડાણ વધુ અનુકૂળ છે.",
      views: [
        {
          number: 4,
          en: "Number 7 can understand and support 4's unusual path.",
          gu: "7, 4ના અલગ માર્ગને સમજીને સહકાર આપી શકે છે.",
        },
        {
          number: 7,
          en: "The 7 chapter also supports this as a life partnership.",
          gu: "7ના અધ્યાયમાં પણ આ જોડાને જીવનસાથી તરીકે સમર્થન છે.",
        },
      ],
    },
    "4-8": {
      status: "favourable",
      en: "Johari describes 4 and 8 as a good marriage combination, with a Number 8 man and Number 4 woman given the stronger role preference.",
      gu: "Johari 4 અને 8ને સારું લગ્નસંયોજન ગણે છે; મૂળાંક 8 પુરુષ અને મૂળાંક 4 સ્ત્રીને વધુ અનુકૂળ ભૂમિકા ગણાવે છે.",
      views: [
        {
          number: 4,
          en: "Number 8 can give structure and shared endurance to 4.",
          gu: "8, 4ને માળખું અને સહનશક્તિનો સહકાર આપી શકે છે.",
        },
        {
          number: 8,
          en: "The 8 chapter also supports 4 as a marriage partner.",
          gu: "8ના અધ્યાયમાં પણ 4ને લગ્નસાથી તરીકે સમર્થન છે.",
        },
      ],
    },
    "4-9": {
      status: "conditional",
      en: "Johari generally advises caution or avoidance for 4 and 9. Only one role arrangement is described as possible when necessary.",
      gu: "Johari 4 અને 9 માટે સામાન્ય રીતે સાવચેતી અથવા ટાળવાની સલાહ આપે છે. જરૂરી હોય ત્યારે માત્ર એક ભૂમિકા શક્ય ગણાવી છે.",
      views: [
        {
          number: 4,
          en: "The 4 chapter treats 9 as a difficult marriage relation.",
          gu: "4ના અધ્યાયમાં 9 સાથેનું લગ્નસંબંધ મુશ્કેલ ગણાવ્યું છે.",
        },
        {
          number: 9,
          en: "The 9 chapter also warns about conflict with 4.",
          gu: "9ના અધ્યાયમાં પણ 4 સાથેના મતભેદ અંગે ચેતવણી છે.",
        },
      ],
      roles: [
        {
          man: 9,
          woman: 4,
          status: "conditional",
          en: "A Number 9 man with a Number 4 woman is the only arrangement Johari treats as possible if necessary.",
          gu: "જરૂરી હોય તો મૂળાંક 9 પુરુષ અને મૂળાંક 4 સ્ત્રીનું જોડાણ જ Johari શક્ય ગણે છે.",
        },
        {
          man: 4,
          woman: 9,
          status: "notRecommended",
          en: "The reverse arrangement is especially discouraged.",
          gu: "ઉલટું જોડાણ ખાસ કરીને ટાળવાનું બતાવ્યું છે.",
        },
      ],
    },
    "5-5": {
      status: "favourable",
      en: "Johari describes two Number 5 people as compatible in marriage and other partnerships.",
      gu: "Johari બે મૂળાંક 5 લોકોને લગ્ન અને અન્ય ભાગીદારીમાં સુસંગત ગણે છે.",
      views: [
        {
          number: 5,
          en: "Shared Mercury qualities can make the partnership active, adaptable, and communicative.",
          gu: "Mercuryના સમાન ગુણો જોડાણને સક્રિય, અનુકૂળનક્ષમ અને સંવાદી બનાવે છે.",
        },
      ],
    },
    "5-6": {
      status: "conditional",
      en: "Johari describes 5 and 6 as friendly and generally beneficial, but the marriage reading changes with the selected roles.",
      gu: "Johari 5 અને 6ને મૈત્રીપૂર્ણ અને સામાન્ય રીતે લાભદાયક ગણે છે, પરંતુ લગ્નનું અર્થઘટન ભૂમિકાઓ પ્રમાણે બદલાય છે.",
      views: [
        {
          number: 5,
          en: "Number 6 can bring comfort and support to 5.",
          gu: "6, 5ને સુખ અને સહકાર આપી શકે છે.",
        },
        {
          number: 6,
          en: "The 6 chapter distinguishes between the two marriage roles.",
          gu: "6ના અધ્યાયમાં બંને લગ્નભૂમિકાઓ વચ્ચે તફાવત છે.",
        },
      ],
      roles: [
        {
          man: 6,
          woman: 5,
          status: "favourable",
          en: "A Number 6 man with a Number 5 woman is described as very good.",
          gu: "મૂલાંક 6 પુરુષ અને મૂળાંક 5 સ્ત્રીનું જોડાણ ખૂબ સારું ગણાવ્યું છે.",
        },
        {
          man: 5,
          woman: 6,
          status: "notRecommended",
          en: "A Number 5 man with a Number 6 woman is not described as an ideal marriage arrangement.",
          gu: "મૂલાંક 5 પુરુષ અને મૂળાંક 6 સ્ત્રીનું જોડાણ આદર્શ લગ્ન તરીકે ગણાવ્યું નથી.",
        },
      ],
    },
    "5-7": {
      status: "notRecommended",
      en: "Johari does not recommend 5 and 7 for marriage, close friendship, or business partnership.",
      gu: "Johari 5 અને 7ને લગ્ન, નજીકની મિત્રતા અથવા વ્યવસાયિક ભાગીદારી માટે ભલામણ કરતા નથી.",
      views: [
        {
          number: 5,
          en: "The 5 chapter treats 7 as an unstable close relation.",
          gu: "5ના અધ્યાયમાં 7ને અસ્થિર નજીકનો સંબંધ ગણાવ્યો છે.",
        },
        {
          number: 7,
          en: "The 7 chapter also does not support the marriage pairing.",
          gu: "7ના અધ્યાયમાં પણ લગ્નજોડાને સમર્થન નથી.",
        },
      ],
    },
    "5-8": {
      status: "notRecommended",
      en: "Johari advises 5 and 8 to avoid marriage with each other.",
      gu: "Johari 5 અને 8ને એકબીજા સાથે લગ્ન ટાળવાની સલાહ આપે છે.",
      views: [
        {
          number: 5,
          en: "Number 8 is not presented as a favourable life partner for 5.",
          gu: "8ને 5 માટે અનુકૂળ જીવનસાથી ગણાવ્યો નથી.",
        },
        {
          number: 8,
          en: "The 8 chapter also discourages the pairing.",
          gu: "8ના અધ્યાયમાં પણ આ જોડાણને પ્રોત્સાહન નથી.",
        },
      ],
    },
    "5-9": {
      status: "conditional",
      en: "Johari says marriage between 5 and 9 is possible but treats it as a last choice; shared spiritual interest may help it last.",
      gu: "Johari મુજબ 5 અને 9ના લગ્ન શક્ય છે, પરંતુ તેને છેલ્લી પસંદગી ગણાવે છે; સમાન આધ્યાત્મિક રસ સંબંધ ટકાવવામાં મદદરૂપ થઈ શકે છે.",
      views: [
        {
          number: 5,
          en: "Number 9 may feel too forceful for 5 unless values and purpose are shared.",
          gu: "સમાન મૂલ્યો અને હેતુ ન હોય તો 9, 5 માટે વધુ કડક લાગી શકે છે.",
        },
        {
          number: 9,
          en: "The bond can continue when both are spiritually inclined.",
          gu: "બંને આધ્યાત્મિક વલણ ધરાવે તો સંબંધ ચાલી શકે છે.",
        },
      ],
    },
    "6-6": {
      status: "conditional",
      en: "Johari does not call two Number 6 people an ideal marriage pair, though they can create a good family environment.",
      gu: "Johari બે મૂળાંક 6 લોકોને આદર્શ લગ્નજોડું ગણાવતા નથી, જોકે તેઓ સારું કુટુંબ વાતાવરણ બનાવી શકે છે.",
      views: [
        {
          number: 6,
          en: "Shared Venus qualities support comfort and family life, but sameness does not automatically make the marriage ideal.",
          gu: "Venusના સમાન ગુણો સુખ અને કુટુંબજીવનને ટેકો આપે છે, પરંતુ સમાનતા લગ્નને આપમેળે આદર્શ બનાવતી નથી.",
        },
      ],
    },
    "6-7": {
      status: "conditional",
      en: "Johari generally sees 6 and 7 as a difficult couple, but one role arrangement is specifically described as workable.",
      gu: "Johari સામાન્ય રીતે 6 અને 7ને મુશ્કેલ જોડું ગણે છે, પરંતુ એક ચોક્કસ ભૂમિકા ચાલે એવી બતાવે છે.",
      views: [
        {
          number: 6,
          en: "Number 7 may feel detached from the comfort and reassurance sought by 6.",
          gu: "6 જે સુખ અને ખાતરી શોધે છે તેમાં 7 થોડો અલિપ્ત લાગી શકે છે.",
        },
        {
          number: 7,
          en: "The 7 chapter gives a favourable exception for one role arrangement.",
          gu: "7ના અધ્યાયમાં એક ભૂમિકા માટે અનુકૂળ અપવાદ છે.",
        },
      ],
      roles: [
        {
          man: 7,
          woman: 6,
          status: "favourable",
          en: "A Number 7 man with a Number 6 woman is described as the workable arrangement.",
          gu: "મૂલાંક 7 પુરુષ અને મૂળાંક 6 સ્ત્રીનું જોડાણ ચાલે એવું ગણાવ્યું છે.",
        },
        {
          man: 6,
          woman: 7,
          status: "notRecommended",
          en: "The reverse arrangement is not recommended as a good marriage pair.",
          gu: "ઉલટું જોડાણ સારા લગ્નજોડા તરીકે ભલામણ કરાયેલ નથી.",
        },
      ],
    },
    "6-8": {
      status: "conditional",
      en: "Johari gives mixed, temporary, and role-dependent guidance. Attraction or practical benefit may exist, but permanence is questioned.",
      gu: "Johariનું માર્ગદર્શન મિશ્ર, અસ્થાયી અને ભૂમિકા આધારિત છે. આકર્ષણ અથવા વ્યવહારિક લાભ હોઈ શકે છે, પરંતુ સ્થાયિત્વ અંગે સવાલ છે.",
      views: [
        {
          number: 6,
          en: "The 6 chapter sees only limited good years in one role arrangement.",
          gu: "6ના અધ્યાયમાં એક ભૂમિકામાં માત્ર મર્યાદિત સારા વર્ષ બતાવ્યા છે.",
        },
        {
          number: 8,
          en: "The 8 chapter says life partnership can work for a time but may not remain permanent.",
          gu: "8ના અધ્યાયમાં જીવનસાથીનું જોડાણ થોડો સમય ચાલી શકે, પરંતુ કાયમી ન રહે એવી વાત છે.",
        },
      ],
      roles: [
        {
          man: 8,
          woman: 6,
          status: "conditional",
          en: "A Number 6 woman may be fortunate for a Number 8 man, but the text still questions permanence.",
          gu: "મૂલાંક 6 સ્ત્રી મૂળાંક 8 પુરુષ માટે ભાગ્યશાળી હોઈ શકે છે, છતાં પુસ્તક સ્થાયિત્વ અંગે સવાલ કરે છે.",
        },
        {
          man: 6,
          woman: 8,
          status: "challenging",
          en: "The reverse role has no strong long-term recommendation.",
          gu: "ઉલટી ભૂમિકાને મજબૂત લાંબા ગાળાની ભલામણ નથી.",
        },
      ],
    },
    "6-9": {
      status: "favourable",
      en: "Johari describes 6 and 9 as a good marriage pair, especially a Number 9 man with a Number 6 woman.",
      gu: "Johari 6 અને 9ને સારું લગ્નજોડું ગણે છે—ખાસ કરીને મૂળાંક 9 પુરુષ અને મૂળાંક 6 સ્ત્રીનું જોડાણ.",
      views: [
        {
          number: 6,
          en: "Number 9 can bring strength and protection to 6.",
          gu: "9, 6ને શક્તિ અને રક્ષણનો અનુભવ આપી શકે છે.",
        },
        {
          number: 9,
          en: "Number 6 can bring warmth, comfort, and family support to 9.",
          gu: "6, 9ને ઉષ્મા, સુખ અને કુટુંબનો સહકાર આપી શકે છે.",
        },
      ],
    },
    "7-7": {
      status: "notRecommended",
      en: "Johari advises two Number 7 people not to choose each other as life partners.",
      gu: "Johari બે મૂળાંક 7 લોકોને એકબીજાને જીવનસાથી તરીકે ન પસંદ કરવાની સલાહ આપે છે.",
      views: [
        {
          number: 7,
          en: "Shared detachment and fluctuation can make the marriage difficult to ground.",
          gu: "સમાન અલિપ્તતા અને ચઢાવ-ઉતારથી લગ્નને સ્થિર આધાર આપવો મુશ્કેલ બની શકે છે.",
        },
      ],
    },
    "7-8": {
      status: "challenging",
      en: "Johari does not regard 7 and 8 as an ideal marriage pair. A shared interest in spiritual or occult subjects may help them coexist.",
      gu: "Johari 7 અને 8ને આદર્શ લગ્નજોડું માનતા નથી. આધ્યાત્મિક અથવા રહસ્યમય વિષયોમાં સમાન રસ સાથે રહેવામાં મદદ કરી શકે છે.",
      views: [
        {
          number: 7,
          en: "Number 8 may feel too heavy or demanding for 7.",
          gu: "8, 7 માટે વધુ ભારરૂપ અથવા માંગવાળો લાગી શકે છે.",
        },
        {
          number: 8,
          en: "Shared serious or spiritual interests can provide a limited bridge.",
          gu: "સમાન ગંભીર અથવા આધ્યાત્મિક રસ મર્યાદિત જોડાણ બનાવી શકે છે.",
        },
      ],
    },
    "7-9": {
      status: "conditional",
      en: "Johari generally treats 7 and 9 as a difficult marriage pair, but gives one favourable role arrangement.",
      gu: "Johari સામાન્ય રીતે 7 અને 9ને મુશ્કેલ લગ્નજોડું ગણે છે, પરંતુ એક ભૂમિકાને અનુકૂળ ગણાવે છે.",
      views: [
        {
          number: 7,
          en: "Number 9's intensity can conflict with 7's sensitive and independent direction.",
          gu: "9ની તીવ્રતા 7ની સંવેદનશીલ અને સ્વતંત્ર દિશા સાથે ટકરાઈ શકે છે.",
        },
        {
          number: 9,
          en: "The 9 chapter permits the pairing only in the stated role arrangement.",
          gu: "9ના અધ્યાયમાં જણાવેલી ભૂમિકામાં જ જોડાણને અનુકૂળતા છે.",
        },
      ],
      roles: [
        {
          man: 9,
          woman: 7,
          status: "favourable",
          en: "A Number 9 man with a Number 7 woman is the favourable arrangement described by Johari.",
          gu: "Johari મુજબ મૂળાંક 9 પુરુષ અને મૂળાંક 7 સ્ત્રીનું જોડાણ અનુકૂળ છે.",
        },
        {
          man: 7,
          woman: 9,
          status: "notRecommended",
          en: "The reverse arrangement is not recommended.",
          gu: "ઉલટું જોડાણ ભલામણ કરાયેલ નથી.",
        },
      ],
    },
    "8-8": {
      status: "favourable",
      en: "Johari describes two Number 8 people as good life partners, especially when they share service or welfare-oriented work.",
      gu: "Johari બે મૂળાંક 8 લોકોને સારા જીવનસાથી ગણે છે—ખાસ કરીને સેવા અથવા લોકકલ્યાણના સમાન કાર્યમાં.",
      views: [
        {
          number: 8,
          en: "Shared discipline, endurance, and purpose can strengthen this partnership.",
          gu: "સમાન શિસ્ત, સહનશક્તિ અને હેતુ આ જોડાણને મજબૂત બનાવી શકે છે.",
        },
      ],
    },
    "8-9": {
      status: "conditional",
      en: "Johari's directional chapters are cautious and not fully consistent. The only partly supported role is a Number 8 man with a Number 9 woman, and even that may be temporary.",
      gu: "Johariના દિશાત્મક અધ્યાયો સાવચેત અને સંપૂર્ણપણે એકસરખા નથી. માત્ર મૂળાંક 8 પુરુષ/9 સ્ત્રીનું જોડાણ થોડું સમર્થિત છે, અને તે પણ અસ્થાયી હોઈ શકે છે.",
      views: [
        {
          number: 8,
          en: "The 8 chapter allows marriage with 9 but describes role-dependent limits.",
          gu: "8નો અધ્યાય 9 સાથે લગ્નની શક્યતા માને છે, પરંતુ ભૂમિકા આધારિત મર્યાદા બતાવે છે.",
        },
        {
          number: 9,
          en: "The 9 chapter generally advises avoidance, with only one limited exception.",
          gu: "9નો અધ્યાય સામાન્ય રીતે ટાળવાની સલાહ આપે છે અને માત્ર એક મર્યાદિત અપવાદ રાખે છે.",
        },
      ],
      roles: [
        {
          man: 8,
          woman: 9,
          status: "conditional",
          en: "A Number 8 man with a Number 9 woman may be good for some time, but the text does not describe it as permanently secure.",
          gu: "મૂલાંક 8 પુરુષ અને મૂળાંક 9 સ્ત્રીનું જોડાણ થોડો સમય સારું રહી શકે છે, પરંતુ પુસ્તક તેને કાયમી સુરક્ષિત ગણાવતું નથી.",
        },
        {
          man: 9,
          woman: 8,
          status: "notRecommended",
          en: "A Number 9 man with a Number 8 woman is discouraged and linked with financial strain.",
          gu: "મૂલાંક 9 પુરુષ અને મૂળાંક 8 સ્ત્રીનું જોડાણ ટાળવાનું અને આર્થિક તણાવ સાથે જોડાયેલ ગણાવ્યું છે.",
        },
      ],
    },
    "9-9": {
      status: "conditional",
      en: "Johari does not call two Number 9 people an ideal pair. The marriage can last, but arguments, intensity, or isolation may remain recurring themes.",
      gu: "Johari બે મૂળાંક 9 લોકોને આદર્શ જોડું ગણાવતા નથી. લગ્ન ટકી શકે છે, પરંતુ વાદવિવાદ, તીવ્રતા અથવા અલગાવની ભાવના વારંવાર આવી શકે છે.",
      views: [
        {
          number: 9,
          en: "Shared Mars energy gives strength and passion, but can also intensify conflict.",
          gu: "Marsની સમાન ઊર્જા શક્તિ અને ઉત્સાહ આપે છે, પરંતુ મતભેદ પણ વધારી શકે છે.",
        },
      ],
    },
  });

  const COMPOUND_DAY_NOTES = Object.freeze({
    10: {
      en: "Johari describes 10 as success after struggle and advises alertness and self-reliance; no direct marriage verdict is given.",
      gu: "Johari 10ને સંઘર્ષ પછીની સફળતા સાથે જોડે છે અને સજાગતા તથા સ્વાવલંબનની સલાહ આપે છે; સીધો લગ્નનિર્ણય આપ્યો નથી.",
    },
    11: {
      en: "Johari calls 11 dynamic and sensitive, and notes emotional highs, lows, and possible periodic separation from a life partner.",
      gu: "Johari 11ને ગતિશીલ અને સંવેદનશીલ ગણે છે તથા ભાવનાત્મક ચઢાવ-ઉતાર અને જીવનસાથીથી સમયાંતરે અંતરનો ઉલ્લેખ કરે છે.",
    },
    12: {
      en: "Johari describes an inner conflict between 1 and 2, but also says these people can enjoy their personal lives; no direct marriage verdict is given.",
      gu: "Johari 1 અને 2 વચ્ચેનો આંતરિક સંઘર્ષ બતાવે છે, સાથે વ્યક્તિગત જીવન માણવાની ક્ષમતા પણ કહે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    13: {
      en: "Johari describes 13 as practical, alert, and dependable after overcoming irritability; no direct marriage verdict is given.",
      gu: "Johari 13ને ચીડિયાપણું સંભાળી લીધા પછી વ્યવહારુ, સજાગ અને વિશ્વસનીય ગણે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    14: {
      en: "Johari links 14 with inner conflict, frequent change, and risk-taking; careful judgment in relationships is sensible, but no direct marriage verdict is given.",
      gu: "Johari 14ને આંતરિક સંઘર્ષ, વારંવાર ફેરફાર અને જોખમ સાથે જોડે છે; સંબંધમાં સાવચેત નિર્ણય યોગ્ય છે, પરંતુ સીધો લગ્નનિર્ણય નથી.",
    },
    15: {
      en: "Johari describes 15 as attractive, charming, and likely to receive cooperation from the opposite sex; no direct marriage verdict is given.",
      gu: "Johari 15ને આકર્ષક અને મોહક ગણે છે તથા વિપરીત લિંગથી સહકાર મળવાની વાત કરે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    16: {
      en: "Johari describes 16 as a combination that can create inner conflict, uncertainty, and anxiety; no direct marriage verdict is given.",
      gu: "Johari 16ને આંતરિક સંઘર્ષ, અનિશ્ચિતતા અને ચિંતા સર્જી શકે એવું સંયોજન ગણે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    17: {
      en: "Johari notes struggle in personal and family life and advises careful selection of friends and helpers; no direct marriage verdict is given.",
      gu: "Johari વ્યક્તિગત અને કુટુંબજીવનમાં સંઘર્ષનો ઉલ્લેખ કરે છે અને મિત્રો-સહાયકોની સાવચેત પસંદગી કહે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    18: {
      en: "Johari explicitly links 18 with unrest in personal and family life and difficulty in marital relationships.",
      gu: "Johari 18ને વ્યક્તિગત તથા કુટુંબજીવનની અશાંતિ અને વૈવાહિક સંબંધોની મુશ્કેલી સાથે સ્પષ્ટ રીતે જોડે છે.",
    },
    19: {
      en: "Johari says the obstinacy and short temper associated with 19 can create problems in married life.",
      gu: "Johari મુજબ 19 સાથે જોડાયેલ હઠ અને ટૂંકો ગુસ્સો લગ્નજીવનમાં સમસ્યા ઊભી કરી શકે છે.",
    },
    20: {
      en: "Johari describes the married life of 20 as often unsuccessful and warns about neglecting family members.",
      gu: "Johari 20નું લગ્નજીવન ઘણી વાર અસફળ રહેવાનું અને કુટુંબની અવગણના થવાની ચેતવણી આપે છે.",
    },
    21: {
      en: "Johari describes 21 as social and popular with the opposite sex; no direct marriage verdict is given.",
      gu: "Johari 21ને સામાજિક અને વિપરીત લિંગમાં લોકપ્રિય ગણે છે; સીધો લગ્નનિર્ણય આપ્યો નથી.",
    },
    22: {
      en: "Johari notes family separation and, for some men, remarriage; marital problems are treated as a special challenge of 22.",
      gu: "Johari 22માં કુટુંબથી અલગાવ અને કેટલાક પુરુષોમાં પુનર્લગ્નનો ઉલ્લેખ કરે છે; લગ્નસંબંધિત મુશ્કેલીને ખાસ પડકાર ગણાવે છે.",
    },
    23: {
      en: "Johari says 23 can receive benefit and help from the opposite sex; no direct marriage verdict is given.",
      gu: "Johari મુજબ 23ને વિપરીત લિંગથી લાભ અને મદદ મળી શકે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    24: {
      en: "Johari says ordinary family life is possible when the Destiny and Name Numbers harmonize with the Psychic Number.",
      gu: "Johari મુજબ ભાગ્યાંક અને નામંક મૂળાંક સાથે સુસંગત હોય તો સામાન્ય કુટુંબજીવન શક્ય બને છે.",
    },
    25: {
      en: "Johari describes 25 as unlucky in love affairs but capable of financial gain through marriage.",
      gu: "Johari 25ને પ્રેમસંબંધમાં ઓછું ભાગ્યશાળી, પરંતુ લગ્નથી આર્થિક લાભ મળવાની શક્યતા ધરાવતું ગણે છે.",
    },
    26: {
      en: "Johari advises careful life-partner selection for 26. The text especially supports partners with root numbers 1, 3, 6, or 8 and gives additional preference to an 8 born on the 8th or 17th.",
      gu: "Johari 26 માટે જીવનસાથીની સાવચેત પસંદગી કહે છે. પુસ્તક ખાસ કરીને મૂળાંક 1, 3, 6 અથવા 8ને સમર્થન આપે છે અને 8 અથવા 17 તારીખે જન્મેલા 8ને વધારાની પસંદગી આપે છે.",
    },
    27: {
      en: "Johari describes 27 as loving and devoted to family or organization; no direct marriage verdict is given.",
      gu: "Johari 27ને પ્રેમાળ અને કુટુંબ અથવા સંસ્થા પ્રત્યે સમર્પિત ગણે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    28: {
      en: "Johari describes 28 as cooperative and philosophical after struggle; no direct marriage verdict is given.",
      gu: "Johari 28ને સંઘર્ષ પછી સહકાર આપનાર અને તત્ત્વચિંતનવાળો ગણે છે; સીધો લગ્નનિર્ણય નથી.",
    },
    29: {
      en: "Johari warns that 29 may experience dissatisfaction in marital life and emphasizes careful partner selection and harmony among Psychic, Destiny, and Name Numbers.",
      gu: "Johari 29 માટે લગ્નજીવનમાં અસંતોષની શક્યતા બતાવે છે અને જીવનસાથીની સાવચેત પસંદગી તથા મૂળાંક, ભાગ્યાંક અને નામંકની સુસંગતતા પર ભાર મૂકે છે.",
    },
    30: {
      en: "Johari says 30 can be strongly influenced by the opposite sex and benefits when Destiny and Name Numbers are harmonious; no direct marriage verdict is given.",
      gu: "Johari મુજબ 30 પર વિપરીત લિંગનો પ્રભાવ વધુ હોઈ શકે છે અને સુસંગત ભાગ્યાંક-નામંકથી લાભ થાય છે; સીધો લગ્નનિર્ણય નથી.",
    },
    31: {
      en: "Johari describes 31 as independent, private, and sometimes isolated; no direct marriage verdict is given.",
      gu: "Johari 31ને સ્વતંત્ર, ખાનગી સ્વભાવવાળો અને ક્યારેક એકલતાવાળો ગણે છે; સીધો લગ્નનિર્ણય નથી.",
    },
  });

  const YEAR_THEMES = Object.freeze({
    1: {
      title: "Progress and beneficial change",
      guTitle: "પ્રગતિ અને લાભદાયક ફેરફાર",
      en: "Old difficulties may lessen. Helpful people, progress, important change, and organized effort are favoured. Johari gives no specific marriage promise for this year.",
      gu: "જૂની મુશ્કેલીઓ ઓછી થઈ શકે છે. મદદરૂપ લોકો, પ્રગતિ, મહત્વનો ફેરફાર અને આયોજનબદ્ધ પ્રયત્ન માટે સમય અનુકૂળ છે. Johari આ વર્ષ માટે ખાસ લગ્નવચન આપતા નથી.",
    },
    2: {
      title: "Magnetism, patience, and support",
      guTitle: "આકર્ષણ, ધીરજ અને સહકાર",
      en: "Personal magnetism and helpful friendships may grow. Patience and good planning are important. Johari gives no specific marriage promise for this year.",
      gu: "વ્યક્તિગત આકર્ષણ અને મદદરૂપ મિત્રતા વધી શકે છે. ધીરજ અને સારું આયોજન મહત્વનું છે. Johari આ વર્ષ માટે ખાસ લગ્નવચન આપતા નથી.",
    },
    3: {
      title: "Auspicious growth and clarity",
      guTitle: "શુભ વિકાસ અને સ્પષ્ટતા",
      en: "Knowledge, new acquaintances, expression, honour, and completion of old work are supported. Trust should still be tested carefully.",
      gu: "જ્ઞાન, નવા પરિચય, અભિવ્યક્તિ, માન અને જૂના કામ પૂર્ણ કરવા માટે સહકાર છે. વિશ્વાસ પહેલાં તપાસ જરૂરી છે.",
    },
    4: {
      title: "Life-partner and family support",
      guTitle: "જીવનસાથી અને કુટુંબ માટે સહાયક",
      en: "Johari specifically links this year with marriage or finding a life partner, good relations with a partner, and possible childbirth for a married couple. Casual love affairs are not favoured.",
      gu: "Johari ખાસ કરીને આ વર્ષને લગ્ન અથવા જીવનસાથી મળવા, જીવનસાથી સાથે સારા સંબંધ અને લગ્નિત દંપતી માટે સંતાનની શક્યતા સાથે જોડે છે. સામાન્ય પ્રેમસંબંધ માટે સમય અનુકૂળ નથી.",
    },
    5: {
      title: "Movement, success, and social growth",
      guTitle: "ગતિ, સફળતા અને સામાજિક વિકાસ",
      en: "Success, travel, communication, business partnership, and a wider social circle are supported. Care is advised while speaking or signing agreements.",
      gu: "સફળતા, મુસાફરી, સંવાદ, વ્યવસાયિક ભાગીદારી અને મોટું સામાજિક વર્તુળ અનુકૂળ છે. બોલતી વખતે અથવા કરાર કરતી વખતે સાવચેતી રાખવી.",
    },
    6: {
      title: "Family harmony and romance",
      guTitle: "કુટુંબ સુમેળ અને રોમાન્સ",
      en: "Johari specifically calls this year good for family relationships, romance, and conceiving a child. Comfort, beauty, enjoyment, and gifts are emphasized.",
      gu: "Johari ખાસ કરીને આ વર્ષને કુટુંબસંબંધ, રોમાન્સ અને સંતાનધારણ માટે સારું ગણે છે. સુખ, સૌંદર્ય, આનંદ અને ભેટો પર ભાર છે.",
    },
    7: {
      title: "Patience in love and communication",
      guTitle: "પ્રેમ અને સંવાદમાં ધીરજ",
      en: "Misunderstandings and difficulties may arise. Johari advises fewer risks, avoiding unnecessary arguments, and special caution in love or romance to protect reputation.",
      gu: "ગેરસમજ અને મુશ્કેલીઓ થઈ શકે છે. Johari ઓછું જોખમ લેવા, બિનજરૂરી ચર્ચા ટાળવા અને પ્રતિષ્ઠા માટે પ્રેમ અથવા રોમાન્સમાં ખાસ સાવચેતી રાખવાની સલાહ આપે છે.",
    },
    8: {
      title: "Responsibility and worldly effort",
      guTitle: "જવાબદારી અને વ્યવહારિક પ્રયત્ન",
      en: "Worldly progress, independence, and serious work are emphasized. Stress and health need care. Johari gives no specific marriage promise for this year.",
      gu: "વ્યવહારિક પ્રગતિ, સ્વતંત્રતા અને ગંભીર કાર્ય પર ભાર છે. તણાવ અને આરોગ્યની કાળજી જરૂરી છે. Johari આ વર્ષ માટે ખાસ લગ્નવચન આપતા નથી.",
    },
    9: {
      title: "Completion and fulfilment",
      guTitle: "પૂર્ણતા અને ઇચ્છાપૂર્તિ",
      en: "Completion, success, fulfilment, and recognition are supported. Slight disagreements or harsh words are possible, so communication should remain measured.",
      gu: "પૂર્ણતા, સફળતા, ઇચ્છાપૂર્તિ અને માન માટે સમય અનુકૂળ છે. નાના મતભેદ અથવા કઠોર શબ્દો થઈ શકે, તેથી સંવાદ સંયમિત રાખવો.",
    },
  });

  const WEEKDAY_VALUES = Object.freeze({
    0: 1, // Sunday
    1: 2, // Monday
    2: 9, // Tuesday
    3: 5, // Wednesday
    4: 3, // Thursday
    5: 6, // Friday
    6: 8, // Saturday
  });

  global.JOHARI_RULES = Object.freeze({
    PLANETS,
    NAME_VALUES,
    FRIENDS,
    ENEMIES,
    STATUS,
    PAIR_RULES,
    COMPOUND_DAY_NOTES,
    YEAR_THEMES,
    WEEKDAY_VALUES,
  });
})(window);
