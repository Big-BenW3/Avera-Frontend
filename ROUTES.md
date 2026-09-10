# Avera Web - Route Map

## Public Routes (No Auth Required)

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page (7 sections + stats card) | ✅ 200 |
| `/login` | Sign in (split layout) | ✅ 200 |
| `/signup` | Sign up (split layout) | ✅ 200 |
| `/forgot-password` | Password reset (split layout) | ✅ 200 |
| `/onboarding` | 3-step onboarding (split layout) | ✅ 200 |

## App Routes (Product Navigation)

| Route | Page | Status |
|-------|------|--------|
| `/discover` | Dashboard with trending ideas + spaces | ✅ 200 |
| `/ideas` | Ideas board with search/filter/compose | ✅ 200 |
| `/ideas/[id]` | Idea detail (comments, bookmarks, interest) | ✅ 200 |
| `/spaces/create` | 3-step space creation wizard | ✅ 200 |
| `/spaces/[slug]` | Space workspace (8 sub-sections) | ✅ 200 |
| `/inbox` | Messages + calls + AI assist | ✅ 200 |
| `/profile` | User profile | ✅ 200 |
| `/settings` | Notification/AI/safety settings | ✅ 200 |

## Error Routes

| Route | Page | Status |
|-------|------|--------|
| `/*` (non-existent) | 404 Not Found | ✅ 404 |

## Space Workspace Sub-sections

The `/spaces/[slug]` route includes 8 internal sections:
1. Overview - Metrics, team, activity
2. Roadmap - Milestones
3. Tasks - 3-column board (todo/doing/done)
4. Build - GitHub integration
5. Design - Figma integration
6. Collaborate - Chat + calls
7. Team - Member list
8. Activity - Timeline

## Testing All Routes

```bash
# Test all routes
for route in "/" "/login" "/signup" "/forgot-password" "/onboarding" "/discover" "/ideas" "/ideas/idea-luma" "/spaces/create" "/spaces/luma" "/inbox" "/profile" "/settings"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$route)
  echo "$status $route"
done

# Test 404
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/nonexistent
```

## Navigation Flow

```
Landing (/)
  ├─→ Sign In (/login)
  ├─→ Sign Up (/signup) → Onboarding (/onboarding) → Discover (/discover)
  └─→ Explore Ideas (/discover)

Discover (/discover)
  ├─→ View Idea (/ideas/[id])
  ├─→ Create Idea (/ideas)
  ├─→ View Space (/spaces/[slug])
  └─→ Create Space (/spaces/create)

Ideas Board (/ideas)
  ├─→ View Idea (/ideas/[id])
  └─→ Create Idea (inline compose)

Idea Detail (/ideas/[id])
  ├─→ Back to Ideas (/ideas)
  └─→ Open Space (/spaces/create)

Space Workspace (/spaces/[slug])
  ├─→ Overview
  ├─→ Roadmap
  ├─→ Tasks
  ├─→ Build
  ├─→ Design
  ├─→ Collaborate → Inbox (/inbox)
  ├─→ Team
  └─→ Activity

Inbox (/inbox)
  ├─→ Messages
  ├─→ Calls
  └─→ AI Assist

Profile (/profile)
  └─→ Settings (/settings)
```
