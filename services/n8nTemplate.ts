import { ScraperConfig } from '../types';

/**
 * Generates a valid n8n workflow JSON object based on user configuration.
 * This constructs a robust workflow with:
 * 1. Schedule Trigger
 * 2. Configuration Set Node
 * 3. Reddit Search Node
 * 4. Date Filtering Function
 * 5. Google Sheets Lookup (to prevent dupes)
 * 6. Google Sheets Write
 */
export const generateN8nWorkflow = (config: ScraperConfig) => {
  const subredditsArray = config.subreddits.split(',').map(s => s.trim()).filter(Boolean);
  const keywordsArray = config.keywords.split(',').map(k => k.trim()).filter(Boolean);
  const subredditString = subredditsArray.join(',');
  
  // We construct a query string for Reddit search.
  // E.g. "(keyword1 OR keyword2) subreddit:r/saas"
  // However, the Reddit node usually takes one subreddit or a multi-reddit string.
  // To keep it simple for the n8n Reddit node, we will search global with "subreddit:name" syntax or iterate.
  // For this 'Beginner Friendly' generator, we will assume the user inputs the target subreddit in the Reddit node config
  // or we set variables.
  
  const workflow = {
    "name": "Reddit Lead Scraper",
    "nodes": [
      {
        "parameters": {
          "rule": {
            "interval": [
              {
                "field": "hours",
                "hours": config.scheduleHours
              }
            ]
          }
        },
        "id": "Schedule Trigger",
        "name": "Schedule Trigger",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.1,
        "position": [250, 300]
      },
      {
        "parameters": {
          "values": {
            "string": [
              {
                "name": "target_subreddits",
                "value": subredditString
              },
              {
                "name": "search_keywords",
                "value": keywordsArray.join(' OR ')
              },
              {
                "name": "max_days_old",
                "value": config.daysOld.toString()
              }
            ]
          }
        },
        "id": "Config",
        "name": "Config",
        "type": "n8n-nodes-base.set",
        "typeVersion": 2,
        "position": [450, 300]
      },
      {
        "parameters": {
          "resource": "post",
          "operation": "getAll",
          "limit": 50,
          "filters": {
            "subreddit": "={{ $json.target_subreddits }}",
            "searchTerm": "={{ $json.search_keywords }}"
          }
        },
        "id": "Reddit Search",
        "name": "Reddit Search",
        "type": "n8n-nodes-base.reddit",
        "typeVersion": 1,
        "position": [650, 300],
        "credentials": {
          "redditOAuth2Api": {
            "id": "YOUR_REDDIT_CREDENTIALS_ID",
            "name": "Reddit account"
          }
        }
      },
      {
        "parameters": {
          "jsCode": `// Filter posts older than X days
const days = parseInt($('Config').item.json.max_days_old);
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - days);

return items.filter(item => {
  const created = new Date(item.json.created * 1000);
  return created > cutoff;
});`
        },
        "id": "Date Filter",
        "name": "Date Filter",
        "type": "n8n-nodes-base.code",
        "typeVersion": 2,
        "position": [850, 300]
      },
      ...(config.checkDuplicates ? [{
        "parameters": {
          "operation": "lookup",
          "sheetId": {
            "mode": "fromUrl",
            "value": "INSERT_YOUR_GOOGLE_SHEET_URL_HERE"
          },
          "range": "A:E",
          "lookupColumn": "url",
          "lookupValue": "={{ $json.url }}"
        },
        "id": "Check Duplicates",
        "name": "Check Duplicates",
        "type": "n8n-nodes-base.googleSheets",
        "typeVersion": 3,
        "position": [1050, 300],
        "credentials": {
          "googleSheetsOAuth2Api": {
            "id": "YOUR_GOOGLE_SHEETS_CREDENTIALS_ID",
            "name": "Google Sheets account"
          }
        }
      }] : []),
      {
        "parameters": {
          "operation": "append",
          "sheetId": {
            "mode": "fromUrl",
            "value": "INSERT_YOUR_GOOGLE_SHEET_URL_HERE"
          },
          "range": "A:E",
          "columns": {
            "mappingMode": "defineBelow",
            "value": {
              "title": "={{ $json.title }}",
              "url": "={{ $json.url }}",
              "author": "={{ $json.author }}",
              "content": "={{ $json.selftext }}",
              "date": "={{ new Date($json.created * 1000).toISOString() }}"
            }
          },
          "options": {}
        },
        "id": "Save to Sheets",
        "name": "Save to Sheets",
        "type": "n8n-nodes-base.googleSheets",
        "typeVersion": 3,
        "position": [1250, 300],
        "credentials": {
          "googleSheetsOAuth2Api": {
            "id": "YOUR_GOOGLE_SHEETS_CREDENTIALS_ID",
            "name": "Google Sheets account"
          }
        }
      }
    ],
    "connections": {
      "Schedule Trigger": {
        "main": [
          [
            {
              "node": "Config",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Config": {
        "main": [
          [
            {
              "node": "Reddit Search",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Reddit Search": {
        "main": [
          [
            {
              "node": "Date Filter",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Date Filter": {
        "main": [
          [
            {
              "node": config.checkDuplicates ? "Check Duplicates" : "Save to Sheets",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      ...(config.checkDuplicates ? {
        "Check Duplicates": {
          "main": [
            [
              {
                "node": "Save to Sheets",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      } : {})
    }
  };

  return JSON.stringify(workflow, null, 2);
};
