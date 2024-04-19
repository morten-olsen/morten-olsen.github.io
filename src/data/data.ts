import { profile } from '../content/profile/profile.js'
import { type Article, Articles } from './data.articles.js'
import { References } from './data.references.ts'
import { site } from './data.site.ts'
import { Skills } from './data.skills.ts'
import { getJsonLDResume, getJsonResume } from './data.utils.js'
import { Work, type WorkItem } from './data.work.js'

class Data {
  public articles = new Articles()
  public work = new Work()
  public references = new References()
  public skills = new Skills()
  public profile = profile
  public site = site

  public getJsonResume = getJsonResume.bind(null, this)
  public getJsonLDResume = getJsonLDResume.bind(null, this)
}

const data = new Data()

type Profile = typeof profile
export type { Article, Profile, WorkItem }
export { data, Data }
