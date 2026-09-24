import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { zhCN } from '@sanity/locale-zh-cn'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'nanshijiao-glory',
  title: '行道會南勢角榮耀堂',
  projectId: '7zy0rjbx',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('內容管理')
          .items([
            S.listItem()
              .title('每日經文')
              .child(
                S.documentList()
                  .title('每日經文列表')
                  .filter('_type == "dailyScripture"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool(),
    zhCN(),
  ],
  schema: {
    types: schemaTypes,
  },
})
