# 🌲 Dark Forest Content Generators

This directory contains content generation utilities for the Dark Forest system.

## ⚠️ Important Note

**The primary content generation system is now the Always-On Agent System** located in `/apps/agents`. 

These standalone generators are kept for:
1. **Backward Compatibility**: Existing workflows that depend on them
2. **Batch Operations**: One-off content generation without running the full agent system
3. **Testing**: Quick content generation tests

## Active Generators

| File | Purpose | Status |
|------|---------|--------|
| `ProfessionalBlogGenerator.js` | Themed HTML blog generation | ✅ Active |
| `simple-blog-generator.js` | Basic HTML blog generation | ✅ Active |

## Legacy Generators (Deprecated)

These are superseded by the Always-On Agent System:

| File | Replacement | Status |
|------|-------------|--------|
| `ai-content-pipeline.js` | `apps/agents` | ⚠️ Deprecated |
| `openai-content-pipeline.js` | `apps/agents` | ⚠️ Deprecated |
| `real-ai-pipeline.js` | `apps/agents` | ⚠️ Deprecated |
| `complete-pipeline-test.js` | Agent tests | ⚠️ Deprecated |

## Recommended Usage

### For Always-On Content Generation

Use the agent system:

```bash
cd apps/agents
OPENAI_API_KEY=your-key ALWAYS_ON=true pnpm dev
```

### For One-Off Batch Generation

Use the GitHub Actions workflow:

```bash
# Trigger via GitHub Actions UI or:
node generators/openai-content-pipeline.js batch 5
```

### For Quick Testing

```bash
node generators/simple-blog-generator.js
```

## Migration Guide

If you're using the legacy pipelines, migrate to the Always-On Agent System:

1. Set environment variables in `.env`
2. Start the agent service: `cd apps/agents && pnpm dev`
3. Trigger content via API: `POST /api/orchestrator/trigger-pipeline`

The new system provides:
- ✅ True multi-agent collaboration
- ✅ Quality gates and human approval workflows
- ✅ Event-driven and periodic triggers
- ✅ Better error handling and retries
- ✅ Centralized monitoring
