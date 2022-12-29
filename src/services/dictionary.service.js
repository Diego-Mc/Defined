// https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=your-api-key

//https://random-word-api.herokuapp.com/word  => to fetch random word (word of the day)

import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'dictionary'

export const dictionaryService = {
  query, //get search results for text (note: remember HOM)
  getById, //the url would be /dictionary/term, so get would run [term] and get the first result (remember HOM). {{in the cmp, if it got a term we dont use get, only if came from refresh (without giving props to cmp)}}
}
window.cs = dictionaryService

async function query({ search }) {
  return Promise.resolve(safeResult)

  var dictionaries = await storageService.query(STORAGE_KEY)
  const regex = new RegExp(search, 'i')
  dictionaries = dictionaries.filter(
    (dictionary) => regex.test(dictionary) //check id
  )
  return dictionaries
}

function getById(dictionaryId) {
  return Promise.resolve(response)

  return storageService.get(STORAGE_KEY, dictionaryId)
}

const response = {
  meta: {
    id: 'voluminous',
    uuid: '0d01b967-971f-4ec5-8fe0-10513d29c39b',
    sort: '220130400',
    src: 'collegiate',
    section: 'alpha',
    stems: ['voluminous', 'voluminously', 'voluminousness', 'voluminousnesses'],
    offensive: false,
  },
  hwi: {
    hw: 'vo*lu*mi*nous', //** syllables
    prs: [
      {
        mw: 'v\u0259-\u02c8l\u00fc-m\u0259-n\u0259s',
        sound: {
          audio: 'volumi02', //https://media.merriam-webster.com/audio/prons/en/us/wav/[subdirectory]/[base filename].wav
          //subdirectory =
          //{ if audio starts with 'bix' => 'bix'
          //: if with 'gg' => 'gg'
          //: if with a number or punctuation (_) => 'number'
          //: else => first letter of audio ("v" here)}

          //base filename => audio value ("volumi02")
          ref: 'c',
          stat: '1',
        },
      },
    ],
  },
  fl: 'adjective', //fl is the type of definitions
  def: [
    {
      sseq: [
        [
          [
            'sense',
            {
              sn: '1 a',
              dt: [
                //definition text always first item is required in the form:["text",*actual definition*]
                [
                  'text',
                  '{bc}having or marked by great {a_link|volume} or bulk {bc}{sx|large||} ',
                ],
                [
                  'vis',
                  [
                    {
                      t: 'long {wi}voluminous{/wi} tresses',
                    },
                  ],
                ],
              ],
              sdsense: {
                sd: 'also',
                dt: [
                  ['text', '{bc}{sx|full||} '],
                  [
                    'vis',
                    [
                      {
                        t: 'a {wi}voluminous{/wi} skirt',
                      },
                    ],
                  ],
                ],
              },
            },
          ],
          [
            'sense',
            {
              sn: 'b',
              dt: [
                ['text', '{bc}{sx|numerous||} '],
                [
                  'vis',
                  [
                    {
                      t: 'trying to keep track of {wi}voluminous{/wi} slips of paper',
                    },
                  ],
                ],
              ],
            },
          ],
        ],
        [
          [
            'sense',
            {
              sn: '2 a',
              dt: [
                [
                  'text',
                  '{bc}filling or capable of filling a large volume or several {a_link|volumes} ',
                ],
                [
                  'vis',
                  [
                    {
                      t: 'a {wi}voluminous{/wi} literature on the subject',
                    },
                  ],
                ],
              ],
            },
          ],
          [
            'sense',
            {
              sn: 'b',
              dt: [
                ['text', '{bc}writing or speaking much or at great length '],
                [
                  'vis',
                  [
                    {
                      t: 'a {wi}voluminous{/wi} correspondent',
                    },
                  ],
                ],
              ],
            },
          ],
        ],
        [
          [
            'sense',
            {
              sn: '3',
              dt: [
                [
                  'text',
                  '{bc}consisting of many folds, coils, or convolutions {bc}{sx|winding||}',
                ],
              ],
            },
          ],
        ],
      ],
    },
  ],
  uros: [
    {
      ure: 'vo*lu*mi*nous*ly',
      fl: 'adverb',
    },
    {
      ure: 'vo*lu*mi*nous*ness',
      fl: 'noun',
    },
  ],
  et: [
    [
      'text',
      'Late Latin {it}voluminosus{/it}, from Latin {it}volumin-, volumen{/it}',
    ],
  ],
  date: '1611{ds||3||}',
  ld_link: {
    link_hw: 'voluminous',
    link_fl: 'adjective',
  },
  suppl: {
    examples: [
      {
        t: 'the building\u0027s high ceilings and {it}voluminous{/it} spaces',
      },
      {
        t: 'a writer of {it}voluminous{/it} output',
      },
    ],
    ldq: {
      ldhw: 'voluminous',
      fl: 'adjective',
      def: [
        {
          sls: ['formal'],
          sseq: [
            [
              [
                'sense',
                {
                  dt: [
                    ['text', '{bc}very large {bc}containing a lot of space'],
                  ],
                },
              ],
            ],
            [
              [
                'sense',
                {
                  sls: ['of clothing'],
                  dt: [
                    ['text', '{bc}using large amounts of fabric {bc}very full'],
                  ],
                },
              ],
            ],
            [
              [
                'sense',
                {
                  dt: [['text', '{bc}having very many words or pages']],
                },
              ],
            ],
          ],
        },
      ],
    },
  },
  shortdef: [
    'having or marked by great volume or bulk : large; also : full',
    'numerous',
    'filling or capable of filling a large volume or several volumes',
  ],
}

const safeResult = [
  {
    meta: {
      id: 'safe:1', //id is the term (it can have spaces if needed) but always ignore the ":n" is exists, this indicates HOM
      uuid: 'dfdee976-2a6a-4867-9d21-5bcd82f4612b',
      sort: '190150000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe', 'safely', 'safeness', 'safenesses', 'safer', 'safest'],
      offensive: false,
    },
    hom: 1, //when hom is present, the following will have the safe text but diff meaning (for example a verb and an adjective)
    hwi: {
      hw: 'safe',
      prs: [
        {
          mw: 'ˈsāf',
          sound: {
            audio: 'safe0001',
            ref: 'c',
            stat: '1',
          },
        },
      ],
    },
    fl: 'adjective',
    ins: [
      {
        if: 'saf*er',
      },
      {
        if: 'saf*est',
      },
    ],
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                sn: '1',
                dt: [['text', '{bc}free from harm or risk {bc}{sx|unhurt||}']],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '2 a',
                dt: [
                  ['text', '{bc}secure from threat of danger, harm, or loss'],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'b',
                dt: [
                  [
                    'text',
                    '{bc}successful at getting to a base in baseball without being put out',
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '3',
                dt: [
                  [
                    'text',
                    '{bc}affording {a_link|safety} or security from danger, risk, or difficulty',
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '4',
                sls: ['obsolete', 'of mental or moral faculties'],
                dt: [['text', '{bc}{sx|healthy||}, {sx|sound||}']],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '5 a',
                dt: [
                  ['text', '{bc}not threatening danger {bc}{sx|harmless||}'],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'b',
                dt: [
                  [
                    'text',
                    '{bc}unlikely to produce controversy or contradiction',
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '6 a',
                dt: [
                  ['text', '{bc}not likely to take risks {bc}{sx|cautious||}'],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'b',
                dt: [['text', '{bc}{sx|trustworthy||}, {sx|reliable||}']],
              },
            ],
          ],
        ],
      },
    ],
    uros: [
      {
        ure: 'safe',
        vrs: [
          {
            vl: 'or',
            va: 'safe*ly',
          },
        ],
        fl: 'adverb',
      },
      {
        ure: 'safe*ness',
        fl: 'noun',
      },
    ],
    et: [
      [
        'text',
        'Middle English {it}sauf{/it}, from Anglo-French {it}salf, sauf{/it}, from Latin {it}salvus{/it} safe, healthy; akin to Latin {it}solidus{/it} solid, Greek {it}holos{/it} whole, safe, Sanskrit {it}sarva{/it} entire',
      ],
    ],
    date: '14th century{ds||1||}',
    shortdef: [
      'free from harm or risk : unhurt',
      'secure from threat of danger, harm, or loss',
      'successful at getting to a base in baseball without being put out',
    ],
  },
  {
    meta: {
      id: 'safe:2',
      uuid: '8027ebab-ae9c-42c2-ab38-517ff4f5afad',
      sort: '190151000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe', 'safes'],
      offensive: false,
    },
    hom: 2,
    hwi: {
      hw: 'safe',
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                sn: '1',
                dt: [
                  [
                    'text',
                    '{bc}a place or receptacle to keep articles (such as valuables) safe',
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '2',
                dt: [['text', '{bc}{sx|condom||1}']],
              },
            ],
          ],
        ],
      },
    ],
    date: '15th century{ds||1||}',
    shortdef: [
      'a place or receptacle to keep articles (such as valuables) safe',
      'condom',
    ],
  },
  {
    meta: {
      id: 'safe-conduct',
      uuid: '7949e07e-4409-44a8-858a-6be5062f4579',
      sort: '190152000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe-conduct', 'safe-conducts'],
      offensive: false,
    },
    hwi: {
      hw: 'safe-con*duct',
      prs: [
        {
          mw: 'ˈsāf-ˈkän-(ˌ)dəkt',
          sound: {
            audio: 'safeco01',
            ref: 'c',
            stat: '1',
          },
        },
      ],
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                sn: '1',
                dt: [
                  [
                    'text',
                    '{bc}protection given a person passing through a military zone or occupied area',
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '2',
                dt: [['text', '{bc}a document authorizing safe-conduct']],
              },
            ],
          ],
        ],
      },
    ],
    et: [
      [
        'text',
        'Middle English {it}sauf conduit{/it}, from Anglo-French, safe conduct',
      ],
    ],
    date: '14th century{ds||1||}',
    shortdef: [
      'protection given a person passing through a military zone or occupied area',
      'a document authorizing safe-conduct',
    ],
  },
  {
    meta: {
      id: 'safe-deposit box',
      uuid: '43eb9ec3-7ec1-40d7-9ca2-2582785ad321',
      sort: '190154000',
      src: 'collegiate',
      section: 'alpha',
      stems: [
        'safe-deposit box',
        'safe-deposit boxes',
        'safety-deposit box',
        'safety-deposit boxes',
      ],
      offensive: false,
    },
    hwi: {
      hw: 'safe-deposit box',
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}a box (as in the vault of a bank) for safe storage of valuables ',
                  ],
                  [
                    'ca',
                    {
                      intro: 'called also',
                      cats: [
                        {
                          cat: 'safety-deposit box',
                        },
                      ],
                    },
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1870',
    shortdef: [
      'a box (as in the vault of a bank) for safe storage of valuables —called also safety-deposit box',
    ],
  },
  {
    meta: {
      id: 'safe house',
      uuid: '12854315-83d3-4d67-abf7-c933b1bf7a7b',
      sort: '190157000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe house', 'safe houses'],
      offensive: false,
    },
    hwi: {
      hw: 'safe house',
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}a place where one may engage in secret activities or take refuge',
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1928',
    shortdef: [
      'a place where one may engage in secret activities or take refuge',
    ],
  },
  {
    meta: {
      id: 'safe sex',
      uuid: '177c5785-7504-464f-ba06-5ced79ee32b3',
      sort: '190160000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe sex', 'safe sexes', 'safer sex'],
      offensive: false,
    },
    hwi: {
      hw: 'safe sex',
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}sexual activity and especially sexual intercourse in which various measures (such as the use of latex condoms or the practice of monogamy) are taken to avoid disease (such as AIDS) transmitted by sexual contact ',
                  ],
                  [
                    'ca',
                    {
                      intro: 'called also',
                      cats: [
                        {
                          cat: 'safer sex',
                        },
                      ],
                    },
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1968',
    shortdef: [
      'sexual activity and especially sexual intercourse in which various measures (such as the use of latex condoms or the practice of monogamy) are taken to avoid disease (such as AIDS) transmitted by sexual contact —called also safer sex',
    ],
  },
  {
    meta: {
      id: 'safe space',
      uuid: '863f3d23-5595-4be2-95b5-73466ec63986',
      sort: '190161000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe space'],
      offensive: false,
    },
    hwi: {
      hw: 'safe space',
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}a place (as on a college campus) intended to be free of bias, conflict, criticism, or potentially threatening actions, ideas, or conversations ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: '… student volunteers put up posters advertising that a "{wi}safe space{/wi}" would be available for anyone who found the debate too upsetting.',
                        aq: {
                          auth: 'Judith Shulevitz',
                        },
                      },
                      {
                        t: 'Women, sexual assault victims, people of color, transgender students. College campuses have created "{wi}safe spaces{/wi}" for all sorts of marginalized groups.',
                        aq: {
                          auth: 'Catherine Rampell',
                        },
                      },
                    ],
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1970',
    shortdef: [
      'a place (as on a college campus) intended to be free of bias, conflict, criticism, or potentially threatening actions, ideas, or conversations',
    ],
  },
  {
    meta: {
      id: 'safe third country agreement',
      uuid: 'b6eb501a-9e97-412e-8516-0c1c4b7d2e6e',
      sort: '190161500',
      src: 'collegiate',
      section: 'alpha',
      stems: ['safe third country agreement', 'safe third country agreements'],
      offensive: false,
    },
    hwi: {
      hw: 'safe third country agreement',
    },
    fl: 'noun',
    def: [
      {
        sls: ['international law'],
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}an agreement between governments stipulating that asylum seekers are required to make a claim for asylum in the country where they first arrive ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'If Mexico signed a {wi}safe third country agreement{/wi}, Central American migrants would no longer be able to cross the U.S.-Mexico border to surrender to U.S. authorities and stay in the country while they await asylum proceedings.',
                        aq: {
                          auth: 'Rafael Bernal',
                        },
                      },
                    ],
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1993',
    shortdef: [
      'an agreement between governments stipulating that asylum seekers are required to make a claim for asylum in the country where they first arrive',
    ],
  },
  {
    meta: {
      id: 'safe pair of hands',
      uuid: '484b37b4-6f9d-41a0-b961-3b77f2e5d530',
      sort: '3016606000',
      src: 'ld',
      section: 'idioms',
      stems: ['safe pair of hands'],
      offensive: false,
    },
    hwi: {
      hw: 'safe pair of hands',
    },
    fl: 'noun phrase',
    def: [
      {
        sls: ['British'],
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}someone who can be trusted with responsibility or a job ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'The next leader of the party should be a {it}safe pair of hands{/it}.',
                      },
                    ],
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    shortdef: ['someone who can be trusted with responsibility or a job'],
  },
  {
    meta: {
      id: 'safe return',
      uuid: '3320c805-5964-481a-81e5-a3a2f0add518',
      sort: '3016607000',
      src: 'ld',
      section: 'idioms',
      stems: ['safe return'],
      offensive: false,
    },
    hwi: {
      hw: 'safe return',
    },
    fl: 'noun',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}the act of taking someone or something back to the proper place completely unharmed ',
                  ],
                  [
                    'uns',
                    [
                      [
                        ['text', '+ {it}of{/it} '],
                        [
                          'vis',
                          [
                            {
                              t: 'The mother demanded a {it}safe return{/it} {it}of{/it} her child.',
                            },
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    shortdef: [
      'the act of taking someone or something back to the proper place completely unharmed —+ of',
    ],
  },
]
