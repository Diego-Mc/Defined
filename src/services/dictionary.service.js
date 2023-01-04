// https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=your-api-key

//https://random-word-api.herokuapp.com/word  => to fetch random word (word of the day)

import axios from 'axios'
import { storageService } from './async-storage.service.js'
const _flattenDeep = require('lodash/flattenDeep')

const STORAGE_KEY = 'dictionary'

export const dictionaryService = {
  query, //get search results for text (note: remember HOM)
  getById, //the url would be /dictionary/term, so get would run [term] and get the first result (remember HOM). {{in the cmp, if it got a term we dont use get, only if came from refresh (without giving props to cmp)}}
}
window.cs = dictionaryService

async function query({ search }) {
  // return Promise.resolve(safeResult)

  //get index 0, if has HOM, get index 1, if has hom get index 2...

  // var dictionaries = await storageService.query(STORAGE_KEY)
  // const regex = new RegExp(search, 'i')
  // dictionaries = dictionaries.filter(
  //   (dictionary) => regex.test(dictionary) //check id
  // )
  // return dictionaries

  const { data } = await axios.get(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${search}?key=${process.env.REACT_APP_DICTIONARY_API_KEY}`
  )
  console.log('1:', data)

  let p = 0
  let terms = []
  while (p < data.length) {
    let term = _cleanResponse(data[p])
    console.log('2:', p, terms, term)
    // for (let i = p + 1; i < data.length; i++) {
    //   if (!data[i]?.hom) break
    //   term = _cleanResponse(data[i], term)
    //   p++
    // }
    while (data?.at(p + 1)?.hom) {
      term = _cleanResponse(data[p + 1], term)
      p++
    }
    terms.push(term)
    p++
  }

  console.log('terms', terms)
  return Promise.resolve(terms)
}

async function getById(dictionaryId) {
  // return Promise.resolve(_cleanResponse(response))
  //TODO: below works! try to useMemo for this?
  console.log('getting from API')
  //TODO: move to backend
  //TODO: try/catch
  const { data } = await axios.get(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${dictionaryId}?key=${process.env.REACT_APP_DICTIONARY_API_KEY}`
  )

  let term = _cleanResponse(data[0])
  for (let i = 1; i < data.length; i++) {
    if (!data[i]?.hom) break
    term = _cleanResponse(data[i], term)
  }

  console.log('termm', term)
  return Promise.resolve(term)

  // const data = await httpService.get(
  //   `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${dictionaryId}?key=${process.env.REACT_APP_DICTIONARY_API_KEY}`
  // )

  return storageService.get(STORAGE_KEY, dictionaryId)
}

function _cleanResponse(
  {
    meta,
    hwi: { hw: syllablesStr, prs: presentations },
    fl: definitionType,
    def: _definitions,
  },
  prev = { definitions: [] }
) {
  //goal:
  /*
  id: 'voluminous',
  syllables: ['vo','lu','mi','nous'],
  audio: '[subdirectory]/[base filename]',
  definitions: [
    {
      type: 'noun',
      definition: ['a plant..', 'anything I said']
    },
    {
      type: 'adjective',
      definition: ['an aircraft..']
    }
  ]
  */

  const getId = ({ id }) => {
    if (!id.includes(':')) return id

    const colonIdx = id.indexOf(':')
    return id.slice(0, colonIdx)
  }

  const getSyllables = (syllablesStr) => {
    if (!syllablesStr.includes('*')) return [syllablesStr]
    else return syllablesStr.split('*')
  }

  const getAudioFileName = (presentations) => {
    if (!presentations || !presentations[0]) return prev?.audio ?? null
    const {
      sound: { audio },
    } = presentations[0]
    let sub

    if (audio.startsWith('bix')) sub = 'bix'
    else if (audio.startsWith('gg')) sub = 'gg'
    else if (/^[0-9_'"$%&]/.test(audio)) sub = 'number'
    else sub = audio.charAt(0)

    return `${sub}/${audio}`
  }

  const getDefinition = (_definitions) => {
    const cleanupText = (text) => {
      const tagPattern = /{[^|}]+}/g
      const placeholdersPattern = /\{[^|}]+\|([^}]+)\}/g

      text = text.replace(tagPattern, '')
      text = text.replace(placeholdersPattern, '$1')
      text = text.replaceAll('|', '')
      return text
    }
    //TODO: fix cleanup
    //TODO: fix variable names
    const defs = _definitions[0].sseq.map((_def) => {
      const flatDef = _flattenDeep(_def[0][1].dt)

      const first = _flattenDeep(_def)
      const firstIdx = first.indexOf('sense')
      const second = _flattenDeep(first[firstIdx + 1].dt)
      const deffIdx = second.indexOf('text')
      const defIdx = flatDef.indexOf('text')

      return cleanupText(second[deffIdx + 1])

      // cleanupText(_def[0][1].dt[0][1])
    })
    return defs
  }

  let definitions = prev.definitions

  const getDefinitions = (_definitions) => {
    definitions.push({
      type: definitionType,
      definition: getDefinition(_definitions),
    })
    return definitions
  }

  return {
    id: getId(meta),
    syllables: getSyllables(syllablesStr),
    audio: getAudioFileName(presentations),
    definitions: getDefinitions(_definitions),
  }
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

const boo = [
  {
    meta: {
      id: 'boo:1',
      uuid: 'dbed7622-204b-42fc-8182-db0f18cdc18a',
      sort: '020340900',
      src: 'collegiate',
      section: 'alpha',
      stems: ['boo'],
      offensive: false,
    },
    hom: 1,
    hwi: {
      hw: 'boo',
      prs: [
        {
          mw: 'ˈbü',
          sound: {
            audio: 'boo00001',
            ref: 'c',
            stat: '1',
          },
        },
      ],
    },
    fl: 'interjection',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'uns',
                    [
                      [
                        [
                          'text',
                          'used to express contempt or disapproval or to startle or frighten',
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
    et: [
      [
        'text',
        'expressive formation; the voiced labial release and high vowel presumably heighten the suddenness of the utterance',
      ],
    ],
    date: '1639',
    shortdef: [
      '—used to express contempt or disapproval or to startle or frighten',
    ],
  },
  {
    meta: {
      id: 'boo:2',
      uuid: '563bda11-a232-4198-9ac8-837c44410d8e',
      sort: '020341000',
      src: 'collegiate',
      section: 'alpha',
      stems: ['boo', 'boos'],
      offensive: false,
    },
    hom: 2,
    hwi: {
      hw: 'boo',
    },
    fl: 'noun',
    ins: [
      {
        il: 'plural',
        if: 'boos',
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
                dt: [['text', '{bc}a shout of disapproval or contempt']],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '2',
                dt: [
                  ['text', '{bc}any utterance at all '],
                  [
                    'uns',
                    [
                      [
                        ['text', 'usually used in negative constructions '],
                        [
                          'vis',
                          [
                            {
                              t: 'never said {wi}boo{/wi}',
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
    et: [['text', 'derivative of {et_link|boo:1|boo:1}']],
    date: '1884{ds||1||}',
    shortdef: [
      'a shout of disapproval or contempt',
      'any utterance at all —usually used in negative constructions',
    ],
  },
  {
    meta: {
      id: 'boo:3',
      uuid: '57e323bf-c92f-42b5-9a45-7903cd352883',
      sort: '020341100',
      src: 'collegiate',
      section: 'alpha',
      stems: ['boo', 'booed', 'booing', 'boos'],
      offensive: false,
    },
    hom: 3,
    hwi: {
      hw: 'boo',
    },
    fl: 'verb',
    ins: [
      {
        if: 'booed',
      },
      {
        if: 'boo*ing',
      },
      {
        if: 'boos',
      },
    ],
    def: [
      {
        vd: 'intransitive verb',
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}to deride especially by uttering a prolonged {it}boo{/it}',
                  ],
                ],
              },
            ],
          ],
        ],
      },
      {
        vd: 'transitive verb',
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  ['text', '{bc}to express disapproval of by booing '],
                  [
                    'vis',
                    [
                      {
                        t: 'the crowd {wi}booed{/wi} the referee',
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
    et: [['text', 'derivative of {et_link|boo:2|boo:2}']],
    date: '1833{ds|i|||}',
    shortdef: [
      'to deride especially by uttering a prolonged boo',
      'to express disapproval of by booing',
    ],
  },
  {
    meta: {
      id: 'boo:4',
      uuid: '124acde2-4123-443a-8d76-6c08c33abfe7',
      sort: '020341150',
      src: 'collegiate',
      section: 'alpha',
      stems: ['boo', 'boos'],
      offensive: false,
    },
    hom: 4,
    hwi: {
      hw: 'boo',
    },
    fl: 'noun',
    ins: [
      {
        il: 'plural',
        if: 'boos',
      },
    ],
    def: [
      {
        sls: ['US slang'],
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}a romantic partner {bc}{sx|sweetheart||}, {sx|honey||} ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'Your parents might keep a sharp eye on potential partners and your besties may lay down difficult "friend tests," but only one real opinion on your new {wi}boo{/wi} truly matters: what your dog thinks of them.',
                        aq: {
                          auth: 'Jaime Lees',
                        },
                      },
                      {
                        t: 'This has left me skeptical of all new relationships—including my new {wi}boo{/wi}.',
                        aq: {
                          auth: 'Griffin Wynne',
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
    et: [
      ['text', 'of uncertain origin'],
      [
        'et_snote',
        [
          [
            't',
            'Perhaps ultimately a hypocoristic reduction of {et_link|brother|brother}, applied to unrelated males, but the details are unclear.',
          ],
        ],
      ],
    ],
    date: '1988',
    shortdef: ['a romantic partner : sweetheart, honey'],
  },
  {
    meta: {
      id: 'boo-boo',
      uuid: '9c7b3b0c-5b7a-42d2-b8bf-29f729d39161',
      sort: '020341800',
      src: 'collegiate',
      section: 'alpha',
      stems: ['boo-boo', 'boo-boos'],
      offensive: false,
    },
    hwi: {
      hw: 'boo-boo',
      prs: [
        {
          mw: 'ˈbü-(ˌ)bü',
          sound: {
            audio: 'boobo01w',
            ref: 'c',
            stat: '1',
          },
        },
      ],
    },
    fl: 'noun',
    ins: [
      {
        il: 'plural',
        if: 'boo-boos',
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
                dt: [
                  [
                    'text',
                    '{bc}a usually trivial injury (such as a bruise or scratch) ',
                  ],
                  ['uns', [[['text', 'used especially by or of a child']]]],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '2',
                dt: [['text', '{bc}{sx|mistake||}, {sx|blunder||}']],
              },
            ],
          ],
        ],
      },
    ],
    et: [
      [
        'text',
        'probably baby-talk alteration of {it}boohoo{/it}, imitation of the sound of weeping',
      ],
    ],
    date: '1932{ds||1||}',
    shortdef: [
      'a usually trivial injury (such as a bruise or scratch) —used especially by or of a child',
      'mistake, blunder',
    ],
  },
  {
    meta: {
      id: 'boo-hoo',
      uuid: 'c6a26ec1-72fb-479c-9e16-284da004e80f',
      sort: '020343050',
      src: 'collegiate',
      section: 'alpha',
      stems: [
        'boo hoo',
        'boo hooed',
        'boo hooing',
        'boo hoos',
        'boo-hoo',
        'boo-hooed',
        'boo-hooing',
        'boo-hoos',
        'boohoo',
        'boohooed',
        'boohooing',
        'boohoos',
      ],
      offensive: false,
    },
    hwi: {
      hw: 'boo-hoo',
      prs: [
        {
          mw: 'bü-ˈhü',
          sound: {
            audio: 'boo-hoo_1',
            ref: 'owl',
            stat: '1',
          },
        },
        {
          mw: 'ˈbü-ˌhü',
        },
      ],
    },
    vrs: [
      {
        vl: 'or',
        va: 'boo*hoo',
      },
      {
        vl: 'or less commonly',
        va: 'boo hoo',
      },
    ],
    fl: 'verb',
    ins: [
      {
        if: 'boo-hooed',
      },
      {
        il: 'or',
        if: 'boo*hooed',
      },
      {
        if: 'boo-hoo*ing',
      },
      {
        il: 'or',
        if: 'boo*hoo*ing',
      },
    ],
    def: [
      {
        vd: 'intransitive verb',
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  ['text', '{bc}to weep loudly and with sobs '],
                  [
                    'vis',
                    [
                      {
                        t: '… even the impeccable Lord Jeffrey, editor of the {it}Edinburgh Review{/it}, confessed to having cried—blubbered, {wi}boohooed{/wi}, snuffled, and sighed—over the death of Little Nell in {it}The Old Curiosity Shop{/it}.',
                        aq: {
                          auth: 'Tom Wolfe',
                        },
                      },
                      {
                        t: 'Joey kept {wi}boo-hooing{/wi} like a real idiot.',
                        aq: {
                          auth: 'Christopher Paul Curtis',
                        },
                      },
                    ],
                  ],
                  [
                    'uns',
                    [
                      [
                        [
                          'text',
                          "often used as an interjection especially in mocking imitation of another's tears, complaints, unhappiness, etc. ",
                        ],
                        [
                          'vis',
                          [
                            {
                              t: 'Before she finished her question, one twin and then the other began to cry. "{wi}Boohoo{/wi}, {wi}boohoo{/wi}," Ernie mocked. "I\'m not staying with crybabies."',
                              aq: {
                                auth: 'Nancy Smiler Levinson',
                              },
                            },
                            {
                              t: 'He said as long as I was being so pure, why not give her the real scoop on her old man? I said because it would crush her. {wi}Boo hoo{/wi}, he said.',
                              aq: {
                                auth: 'George Saunders',
                              },
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
    uros: [
      {
        ure: 'boo-hoo',
        vrs: [
          {
            vl: 'or',
            va: 'boohoo',
          },
        ],
        fl: 'noun',
        ins: [
          {
            il: 'plural',
            if: 'boo-hoos',
          },
          {
            il: 'or',
            if: 'boo*hoos',
          },
        ],
        utxt: [
          [
            'vis',
            [
              {
                t: '… the tough Garden crowd reacted with boos instead of {wi}boo-hoos{/wi}.',
                aq: {
                  auth: 'Richard Johnson',
                },
              },
            ],
          ],
        ],
      },
      {
        ure: 'boo-hoo*ing',
        vrs: [
          {
            vl: 'or',
            va: 'boo*hoo*ing',
          },
        ],
        fl: 'noun',
        utxt: [
          [
            'vis',
            [
              {
                t: '"Woman: cease this detestable {wi}boohooing{/wi} instantly; or else seek the shelter of some other place of worship."',
                aq: {
                  auth: 'George Bernard Shaw',
                },
              },
              {
                t: 'No one feels good after being dumped. The loudest {wi}boo-hooing{/wi} seems to be coming from young people …',
                aq: {
                  auth: 'Jane Bryant Quinn',
                },
              },
            ],
          ],
        ],
      },
    ],
    et: [['text', 'imitative']],
    date: '1806',
    shortdef: [
      "to weep loudly and with sobs —often used as an interjection especially in mocking imitation of another's tears, complaints, unhappiness, etc.",
    ],
  },
]

const book = [
  {
    meta: {
      id: 'book:1',
      uuid: 'da6e8e86-187e-42e0-a412-5063c5c6eee1',
      sort: '020343200',
      src: 'collegiate',
      section: 'alpha',
      stems: [
        'book',
        'bookful',
        'bookfuls',
        'books',
        'in her book',
        'in her good books',
        'in his book',
        'in his good books',
        'in its book',
        'in its good books',
        'in my book',
        'in my good books',
        "in one's book",
        "in one's good books",
        'in our book',
        'in our good books',
        'in their book',
        'in their good books',
        'in your book',
        'in your good books',
        'on the books',
        'one for the book',
        'one for the books',
      ],
      offensive: false,
    },
    hom: 1,
    hwi: {
      hw: 'book',
      prs: [
        {
          mw: 'ˈbu̇k',
          sound: {
            audio: 'book0001',
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
                sn: '1 a',
                dt: [
                  [
                    'text',
                    '{bc}a set of written sheets of skin or paper or tablets of wood or ivory',
                  ],
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
                    '{bc}a set of written, printed, or blank sheets bound together between a front and back cover ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'an address {wi}book{/wi}',
                      },
                    ],
                  ],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'c',
                dt: [
                  [
                    'text',
                    '{bc}a long written or printed literary composition ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'reading a good {wi}book{/wi}',
                      },
                      {
                        t: 'reference {wi}books{/wi}',
                      },
                      {
                        t: 'hardcover and paperback {wi}books{/wi}',
                      },
                    ],
                  ],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'd',
                dt: [
                  [
                    'text',
                    '{bc}a major division of a {d_link|treatise|treatise} or literary work ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'the {wi}books{/wi} of the Bible',
                      },
                    ],
                  ],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'e',
                sls: ['accounting'],
                dt: [
                  [
                    'text',
                    "{bc}a record of a business's financial transactions or financial condition ",
                  ],
                  [
                    'uns',
                    [
                      [
                        ['text', 'often used in plural '],
                        [
                          'vis',
                          [
                            {
                              t: 'the {wi}books{/wi} show a profit',
                            },
                          ],
                        ],
                      ],
                    ],
                  ],
                  ['text', '{dx}see also {dxt|cook the books||}{/dx}'],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'f',
                dt: [['text', '{bc}{sx|magazine||1a}']],
              },
            ],
            [
              'sense',
              {
                sn: 'g',
                dt: [['text', '{bc}{sx|e-book||}']],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '2',
                lbs: ['capitalized'],
                dt: [
                  ['text', '{bc}{sx|bible||1} '],
                  [
                    'vis',
                    [
                      {
                        t: 'put his hand on the {it}Book{/it} and took the oath',
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
                    '{bc}something that yields knowledge or understanding ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'the great {wi}book{/wi} of nature',
                      },
                      {
                        t: 'her face was an open {wi}book{/wi}',
                      },
                    ],
                  ],
                ],
              },
            ],
          ],
          [
            [
              'pseq',
              [
                [
                  'sense',
                  {
                    sn: '4 a (1)',
                    dt: [
                      [
                        'text',
                        '{bc}the total available knowledge and experience that can be brought to bear on a task or problem ',
                      ],
                      [
                        'vis',
                        [
                          {
                            t: 'tried every trick in the {wi}book{/wi}',
                          },
                        ],
                      ],
                    ],
                  },
                ],
                [
                  'sense',
                  {
                    sn: '(2)',
                    dt: [
                      ['text', '{bc}inside information or analysis '],
                      [
                        'vis',
                        [
                          {
                            t: "the {wi}book{/wi} on him is that he can't hit a curveball",
                          },
                        ],
                      ],
                    ],
                  },
                ],
              ],
            ],
            [
              'sense',
              {
                sn: 'b',
                dt: [
                  [
                    'text',
                    '{bc}the standards or authority relevant in a situation ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'runs her business by the {wi}book{/wi}',
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
                sn: '5 a',
                dt: [
                  [
                    'text',
                    '{bc}all the charges that can be made against an accused person ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'threw the {wi}book{/wi} at him',
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
                  [
                    'text',
                    '{bc}a position from which one must answer for certain acts {bc}{sx|account||} ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'bring criminals to {wi}book{/wi}',
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
                sn: '6 a',
                sls: ['musical theater'],
                dt: [['text', '{bc}{sx|libretto||}']],
              },
            ],
            [
              'sense',
              {
                sn: 'b',
                dt: [['text', '{bc}the script of a play']],
              },
            ],
            [
              'sense',
              {
                sn: 'c',
                sls: ['music'],
                dt: [
                  [
                    'text',
                    '{bc}a book of arrangements for a musician or dance orchestra {bc}musical repertory',
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '7',
                dt: [
                  ['text', '{bc}a packet of items bound together like a book '],
                  [
                    'vis',
                    [
                      {
                        t: 'a {wi}book{/wi} of stamps',
                      },
                      {
                        t: 'a {wi}book{/wi} of matches',
                      },
                    ],
                  ],
                ],
              },
            ],
          ],
          [
            [
              'sen',
              {
                sn: '8',
                sls: ['gambling'],
              },
            ],
            [
              'sense',
              {
                sn: 'a',
                dt: [['text', '{bc}{sx|bookmaker||}']],
              },
            ],
            [
              'sense',
              {
                sn: 'b',
                dt: [['text', '{bc}the bets registered by a bookmaker']],
                sdsense: {
                  sd: 'also',
                  dt: [
                    [
                      'text',
                      '{bc}the business or activity of giving odds {dx_def}see {dxt|odds|odds|3b}{/dx_def} and taking bets',
                    ],
                  ],
                },
              },
            ],
          ],
          [
            [
              'sense',
              {
                sn: '9',
                sls: ['card games'],
                dt: [
                  [
                    'text',
                    '{bc}the number of tricks {dx_def}see {dxt|trick:1||4}{/dx_def} a cardplayer or side must win before any trick can have scoring value',
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
        ure: 'book*ful',
        prs: [
          {
            mw: 'ˈbu̇k-ˌfu̇l',
            sound: {
              audio: 'book0003',
              ref: 'c',
              stat: '1',
            },
          },
        ],
        fl: 'noun',
      },
    ],
    dros: [
      {
        drp: "in one's book",
        def: [
          {
            sseq: [
              [
                [
                  'sense',
                  {
                    dt: [['text', "{bc}in one's own opinion"]],
                  },
                ],
              ],
            ],
          },
        ],
      },
      {
        drp: "in one's good books",
        def: [
          {
            sseq: [
              [
                [
                  'sense',
                  {
                    dt: [
                      ['text', '{bc}in favor with one '],
                      [
                        'vis',
                        [
                          {
                            t: "getting back {it}in his boss's good books{/it}",
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
      },
      {
        drp: 'one for the book',
        vrs: [
          {
            vl: 'or',
            va: 'one for the books',
          },
        ],
        def: [
          {
            sseq: [
              [
                [
                  'sense',
                  {
                    dt: [['text', '{bc}an act or occurrence worth noting']],
                  },
                ],
              ],
            ],
          },
        ],
      },
      {
        drp: 'on the books',
        def: [
          {
            sseq: [
              [
                [
                  'sense',
                  {
                    dt: [
                      ['text', '{bc}on the records '],
                      [
                        'vis',
                        [
                          {
                            t: 'outdated laws that are still {it}on the books{/it}',
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
      },
    ],
    et: [
      [
        'text',
        'Middle English, from Old English {it}bōc{/it}; akin to Old High German {it}buoh{/it} book, Goth {it}boka{/it} letter',
      ],
    ],
    date: 'before 12th century{ds||1|a|}',
    shortdef: [
      'a set of written sheets of skin or paper or tablets of wood or ivory',
      'a set of written, printed, or blank sheets bound together between a front and back cover',
      'a long written or printed literary composition',
    ],
  },
  {
    meta: {
      id: 'book:2',
      uuid: 'f32a0def-9659-4456-9606-cbb92deec95c',
      sort: '020343300',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book'],
      offensive: false,
    },
    hom: 2,
    hwi: {
      hw: 'book',
    },
    fl: 'adjective',
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
                    '{bc}derived from books {dx_def}see {dxt|book:1||1}{/dx_def} and not from practical experience ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}book{/wi} learning',
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
                sn: '2',
                sls: ['accounting'],
                dt: [
                  ['text', '{bc}shown by {d_link|ledgers|ledger} '],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}book{/wi} assets',
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
    et: [['text', '{dx_ety}see {dxt|book:1||}{/dx_ety}']],
    date: '13th century{ds||1||}',
    shortdef: [
      'derived from books and not from practical experience',
      'shown by ledgers',
    ],
  },
  {
    meta: {
      id: 'book:3',
      uuid: '7260dd50-cec3-4d43-9d75-1a116efc54b0',
      sort: '020343400',
      src: 'collegiate',
      section: 'alpha',
      stems: [
        'book',
        'bookable',
        'booked',
        'booker',
        'bookers',
        'booking',
        'books',
      ],
      offensive: false,
    },
    hom: 3,
    hwi: {
      hw: 'book',
    },
    fl: 'verb',
    ins: [
      {
        if: 'booked',
      },
      {
        if: 'book*ing',
      },
      {
        if: 'books',
      },
    ],
    def: [
      {
        vd: 'transitive verb',
        sseq: [
          [
            [
              'sense',
              {
                sn: '1 a',
                dt: [
                  [
                    'text',
                    '{bc}to register (something, such as a name) for some future activity or condition (as to engage transportation or reserve lodgings) ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'he was {wi}booked{/wi} to sail on Monday',
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
                  ['text', '{bc}to schedule engagements for '],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}book{/wi} the band for a week',
                      },
                    ],
                  ],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'c',
                dt: [
                  ['text', '{bc}to set aside time for '],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}booking{/wi} a strategy meeting',
                      },
                    ],
                  ],
                ],
              },
            ],
            [
              'sense',
              {
                sn: 'd',
                dt: [
                  ['text', '{bc}to reserve in advance '],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}book{/wi} two seats at the theater',
                      },
                      {
                        t: 'tried to make reservations, but they were all {wi}booked{/wi} up',
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
                sls: ['law enforcement'],
                dt: [
                  [
                    'text',
                    '{bc}to enter charges against in a police register ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'was {wi}booked{/wi} on suspicion of murder',
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
                sls: ['of a referee'],
                dt: [
                  [
                    'text',
                    '{bc}to note the name or number of (someone, such as a soccer player) for a serious infraction of the rules ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}booking{/wi} him for a late tackle',
                      },
                    ],
                  ],
                ],
              },
            ],
          ],
        ],
      },
      {
        vd: 'intransitive verb',
        sseq: [
          [
            [
              'sense',
              {
                sn: '1',
                dt: [
                  ['text', '{bc}to make a reservation '],
                  [
                    'vis',
                    [
                      {
                        t: '{wi}book{/wi} through your travel agent',
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
                sn: '2',
                sls: ['chiefly British'],
                dt: [
                  ['text', '{bc}to register in a hotel '],
                  [
                    'uns',
                    [
                      [
                        ['text', 'usually used with {it}in{/it} '],
                        [
                          'vis',
                          [
                            {
                              t: 'went to the hotel and {wi}booked{/wi} in',
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
          [
            [
              'sense',
              {
                sn: '3',
                sls: ['slang'],
                dt: [['text', '{bc}{sx|leave||}, {sx|go||}']],
                sdsense: {
                  sd: 'especially',
                  dt: [
                    ['text', '{bc}to depart quickly '],
                    [
                      'vis',
                      [
                        {
                          t: 'We {wi}booked{/wi} out of there.',
                        },
                      ],
                    ],
                  ],
                },
              },
            ],
          ],
        ],
      },
    ],
    uros: [
      {
        ure: 'book*able',
        prs: [
          {
            mw: 'ˈbu̇-kə-bəl',
            sound: {
              audio: 'book0002',
              ref: 'c',
              stat: '1',
            },
          },
        ],
        fl: 'adjective',
        sls: ['chiefly British'],
      },
      {
        ure: 'book*er',
        fl: 'noun',
      },
    ],
    et: [['text', '{dx_ety}see {dxt|book:1||}{/dx_ety}']],
    date: '1807{ds|t|1|a|}',
    shortdef: [
      'to register (something, such as a name) for some future activity or condition (as to engage transportation or reserve lodgings)',
      'to schedule engagements for',
      'to set aside time for',
    ],
  },
  {
    meta: {
      id: 'book bag',
      uuid: 'f3e691fc-58e8-491e-ba5d-dce364a5bd00',
      sort: '020343450',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book bag', 'book bags', 'bookbag', 'bookbags'],
      offensive: false,
    },
    hwi: {
      hw: 'book bag',
    },
    vrs: [
      {
        vl: 'or less commonly',
        va: 'book*bag',
        prs: [
          {
            mw: 'ˈbu̇k-ˌbag',
            sound: {
              audio: 'bookbag_1',
              ref: 'owl',
              stat: '1',
            },
          },
        ],
      },
    ],
    fl: 'noun',
    ins: [
      {
        il: 'plural',
        if: 'book bags',
      },
      {
        il: 'also',
        if: 'book*bags',
      },
    ],
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
                    '{bc}a bag or sack (such as a knapsack) often with a handle or strap that is used for holding books and other items ',
                  ],
                  [
                    'vis',
                    [
                      {
                        t: 'Students who attended the event each received a {wi}bookbag{/wi} filled with school supplies such as notebooks, folders, pencil pouches, pencils, pens and crayons.',
                        aq: {
                          auth: 'Ron Zeitlinger',
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
    date: '1611',
    shortdef: [
      'a bag or sack (such as a knapsack) often with a handle or strap that is used for holding books and other items',
    ],
  },
  {
    meta: {
      id: 'book club',
      uuid: '5d82b9d5-094a-4f91-94e6-d949ac7a2a14',
      sort: '020343700',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book club', 'book clubs'],
      offensive: false,
    },
    hwi: {
      hw: 'book club',
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
                    '{bc}an organization that ships selected books to members usually on a regular schedule and often at discount prices',
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
                dt: [
                  [
                    'text',
                    '{bc}a group of people who meet regularly to discuss books they are reading',
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1904{ds||2||}',
    shortdef: [
      'an organization that ships selected books to members usually on a regular schedule and often at discount prices',
      'a group of people who meet regularly to discuss books they are reading',
    ],
  },
  {
    meta: {
      id: 'book louse',
      uuid: '495c72d9-1353-43e6-b8eb-a6a42d9491f7',
      sort: '020344500',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book lice', 'book louse', 'book louses'],
      offensive: false,
    },
    hwi: {
      hw: 'book louse',
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
                    '{bc}any of various tiny usually wingless insects (order Psocoptera and especially genus {it}Liposcelis{/it}) that feed on organic matter and especially mold, usually inhabit damp areas, and are often found in stored papers, books, and grains',
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1753',
    shortdef: [
      'any of various tiny usually wingless insects (order Psocoptera and especially genus Liposcelis) that feed on organic matter and especially mold, usually inhabit damp areas, and are often found in stored papers, books, and grains',
    ],
  },
  {
    meta: {
      id: 'book lung',
      uuid: '5456d61e-9145-46a9-b97f-87b12d954397',
      sort: '020344600',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book lung', 'book lungs'],
      offensive: false,
    },
    hwi: {
      hw: 'book lung',
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
                    '{bc}a saccular breathing organ in many arachnids containing thin folds of membrane arranged like the leaves of a book',
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1881',
    shortdef: [
      'a saccular breathing organ in many arachnids containing thin folds of membrane arranged like the leaves of a book',
    ],
  },
  {
    meta: {
      id: 'book-match',
      uuid: '5a9c03a8-01fe-4593-9817-5371fa0a5535',
      sort: '020345100',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book-match', 'book-matched', 'book-matches', 'book-matching'],
      offensive: false,
    },
    hwi: {
      hw: 'book-match',
      prs: [
        {
          mw: 'ˈbu̇k-ˌmach',
          sound: {
            audio: 'bookm01w',
            ref: 'c',
            stat: '1',
          },
        },
      ],
    },
    fl: 'verb',
    ins: [
      {
        if: 'book-matched',
      },
      {
        if: 'book-match*ing',
      },
      {
        if: 'book-match*es',
      },
    ],
    def: [
      {
        vd: 'transitive verb',
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}to match the grains of (a pair of sheets of veneer or plywood) so that one sheet seems to be the mirror image of the other',
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1942',
    shortdef: [
      'to match the grains of (a pair of sheets of veneer or plywood) so that one sheet seems to be the mirror image of the other',
    ],
  },
  {
    meta: {
      id: 'Book of Common Prayer',
      uuid: '195cfb74-5faf-4c4f-a418-b96325592b61',
      sort: '020345300',
      src: 'collegiate',
      section: 'alpha',
      stems: ['Book of Common Prayer', 'Books of Common Prayer'],
      offensive: false,
    },
    hwi: {
      hw: 'Book of Common Prayer',
    },
    fl: 'noun phrase',
    def: [
      {
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  ['text', '{bc}the service book of the Anglican Communion'],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1549',
    shortdef: ['the service book of the Anglican Communion'],
  },
  {
    meta: {
      id: 'book off',
      uuid: '99406757-6de4-4d93-b6f0-0ed3c9fc8d84',
      sort: '020345400',
      src: 'collegiate',
      section: 'alpha',
      stems: ['book off', 'booked off', 'booking off', 'books off'],
      offensive: false,
    },
    hwi: {
      hw: 'book off',
    },
    fl: 'verb',
    ins: [
      {
        if: 'booked off',
      },
      {
        if: 'book*ing off',
      },
      {
        if: 'books off',
      },
    ],
    def: [
      {
        vd: 'intransitive verb',
        sls: ['chiefly Canada'],
        sseq: [
          [
            [
              'sense',
              {
                dt: [
                  [
                    'text',
                    '{bc}to notify an employer that one is not reporting for work (as because of sickness)',
                  ],
                ],
              },
            ],
          ],
        ],
      },
    ],
    date: '1958',
    shortdef: [
      'to notify an employer that one is not reporting for work (as because of sickness)',
    ],
  },
]
