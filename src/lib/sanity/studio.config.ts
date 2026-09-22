import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'nanshijiao-glory',
  title: '行道會南勢角榮耀堂',
  projectId: '7zy0rjbx',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('內容管理')
          .items([
            S.listItem()
              .id('dailyScripture')
              .title('每日經文')
              .schemaType('dailyScripture')
              .child(
                S.documentList()
                  .id('dailyScriptureList')
                  .title('每日經文列表')
                  .filter('_type == "dailyScripture"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
