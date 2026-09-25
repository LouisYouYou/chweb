import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'
import { StudioLogo } from './components/StudioLogo'
import { StudioNavbar } from './components/StudioNavbar'

export default defineConfig({
  name: 'nanshijiao-glory',
  title: '行道會南勢角榮耀堂',
  projectId: '7zy0rjbx',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      title: '內容管理',
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  studio: {
    components: {
      logo: StudioLogo,
      navbar: StudioNavbar,
    },
  },
})
