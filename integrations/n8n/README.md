# Dark Forest N8N Integration Workflows

This directory contains N8N workflow templates for automating the Dark Forest blog network.

## Workflow Overview

### 1. Daily Content Pipeline (`daily-content-pipeline.json`)
- **Trigger**: Daily at 6 AM
- **Steps**: 
  1. Strategy Agent plans content
  2. Research Agent gathers data
  3. Content Agent writes articles
  4. Human approval (if needed)
  5. Publishing Agent publishes approved content
  6. Social media posting

### 2. Analytics Collection (`analytics-collection.json`)
- **Trigger**: Daily at 10 PM
- **Steps**:
  1. Collect Google Analytics data
  2. Gather social media metrics
  3. Analyze traffic patterns
  4. Generate insights report
  5. Update dashboard

### 3. SEO Monitoring (`seo-monitoring.json`)
- **Trigger**: Weekly
- **Steps**:
  1. Check keyword rankings
  2. Monitor backlinks
  3. Analyze competitor changes
  4. Generate SEO report
  5. Create optimization tasks

### 4. Site Maintenance (`site-maintenance.json`) 
- **Trigger**: Weekly on Sundays at 2 AM
- **Steps**:
  1. Check site health
  2. Update plugins/dependencies
  3. Optimize images
  4. Generate performance report
  5. Alert on issues

### 5. Revenue Optimization (`revenue-optimization.json`)
- **Trigger**: Weekly
- **Steps**:
  1. Analyze ad performance
  2. Test affiliate placements
  3. A/B test monetization
  4. Update revenue reports
  5. Optimize high-performers

## Setup Instructions

### 1. Install N8N
```bash
npm install -g n8n
# or
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

### 2. Import Workflows
1. Open N8N at http://localhost:5678
2. Go to Workflows → Import from JSON
3. Import each .json file from this directory

### 3. Configure Credentials
Set up these credentials in N8N:

- **Dark Forest API**: Your orchestrator API endpoint
- **OpenAI API**: GPT-4 access
- **Google Analytics**: GA4 API access
- **Social Media APIs**: Twitter, LinkedIn, Facebook
- **CMS API**: Strapi/Ghost credentials
- **Monitoring**: Sentry, Uptime Robot

### 4. Environment Variables
```env
# Dark Forest Orchestrator
ORCHESTRATOR_URL=http://localhost:3001
ORCHESTRATOR_API_KEY=your_api_key

# N8N Database (for persistence)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=your_password

# Webhook Security
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password
```

## Webhook Endpoints

Each workflow exposes webhooks for integration:

- **Content Creation**: `POST /webhook/content-pipeline`
- **Analytics Update**: `POST /webhook/analytics`
- **SEO Check**: `POST /webhook/seo-monitoring`
- **Manual Trigger**: `POST /webhook/manual/{workflow-id}`

## Monitoring & Alerts

Configure alerts for:
- ❌ Workflow failures
- ⚠️ Quality threshold violations  
- 📈 Traffic anomalies
- 💰 Revenue drops
- 🚨 Site downtime

## Integration with Orchestrator

N8N workflows communicate with the Dark Forest orchestrator via:

1. **HTTP Requests**: Send tasks to orchestrator
2. **Webhooks**: Receive status updates
3. **Database**: Shared PostgreSQL database
4. **Redis**: Task queue integration

## Custom Nodes

Consider creating custom N8N nodes for:
- Dark Forest API integration
- Content quality analysis
- SEO scoring
- Revenue optimization

## Scaling Considerations

- Use N8N in production mode with database persistence
- Set up multiple N8N instances for high availability
- Monitor workflow execution times and optimize
- Use queues for resource-intensive operations