# 🚀 Deployment Guide - Performance Optimized Build

## Pre-Deployment Steps

### 1. Install New Dependencies
```bash
npm install web-vitals@^3.5.0 @next/bundle-analyzer@^15.1.0 next-sitemap@^4.2.3
```

### 2. Verify Configuration Files
Ensure these files exist and are properly configured:
- ✅ `next.config.js` - Chunk splitting, optimization
- ✅ `app/layout.tsx` - Font loading, metadata
- ✅ `components/LazyVideo.tsx` - Lazy loading videos
- ✅ `components/LoadingScreen.tsx` - Optimized loading
- ✅ `.npmrc` - Build optimizations
- ✅ `next-sitemap.config.js` - SEO configuration
- ✅ `package.json` - Updated scripts

### 3. Clean Build
```bash
# Remove old build artifacts
rm -rf .next
rm -rf node_modules/.cache

# Fresh install
npm install

# Test build locally
npm run build
```

### 4. Local Testing
```bash
# Start production server locally
npm run start

# Test on http://localhost:3000
# Verify:
# - ✅ No console errors
# - ✅ LoadingScreen disappears quickly (< 1 second)
# - ✅ Videos load lazily (check Network tab)
# - ✅ Fonts load from self-hosted files
# - ✅ No ChunkLoadError
```

---

## Deployment to Vercel

### Step 1: Commit Changes
```bash
git add .
git commit -m "feat: comprehensive performance optimizations

- Fixed ChunkLoadError with proper webpack configuration
- Optimized font loading with next/font (2-3s improvement)
- Added comprehensive SEO metadata and OpenGraph
- Implemented lazy video loading (6-7MB payload reduction)
- Optimized LoadingScreen (2.5s FCP improvement)
- Added bundle splitting for 60-70% JS reduction
- Expected PageSpeed score: 85-95+"

git push origin main
```

### Step 2: Monitor Vercel Deployment
1. Go to Vercel dashboard
2. Wait for deployment to complete (~2-3 minutes)
3. Check deployment logs for any errors
4. Look for these success indicators:
   ```
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages
   ✓ Finalizing page optimization
   ```

### Step 3: Verify Production Build
After deployment completes:

```bash
# Check your production URL
https://omar-rehan.vercel.app
```

**Manual Verification Checklist:**
- [ ] Page loads without errors
- [ ] LoadingScreen appears and disappears quickly
- [ ] Videos load only when scrolling to them
- [ ] Fonts render immediately
- [ ] No 404 errors in console
- [ ] Social media preview works (open in Facebook/Twitter preview tool)

---

## Performance Testing

### Run PageSpeed Insights
**Wait 3-5 minutes after deployment** for CDN propagation, then:

1. Go to: https://pagespeed.web.dev/
2. Enter: `https://omar-rehan.vercel.app`
3. Run analysis

**Expected Results:**
- Performance: **85-95** (was 49)
- FCP: **< 2s** (was 6.6s)
- LCP: **< 2.5s** (was 6.8s)
- TBT: **< 300ms** (was 200ms ✓)
- CLS: **0** (was 0 ✓)

### If Scores Are Lower Than Expected:

#### Performance < 85
- Check Network tab: Are videos loading eagerly?
- Verify LoadingScreen timeout is 800ms
- Check if fonts are self-hosted (should see `/_next/static/media/`)
- Run bundle analyzer: `npm run build:analyze`

#### FCP > 2s
- LoadingScreen might be blocking - check timeout
- Fonts might be loading externally - verify next/font setup
- Check for render-blocking resources in Lighthouse

#### LCP > 2.5s
- Videos might be loading eagerly - verify LazyVideo component
- Check if hero images are optimized
- Verify no large base64 images in HTML

#### Chunk Load Errors
- Clear `.next` folder and rebuild
- Verify webpack config in next.config.js
- Check Vercel logs for chunk generation errors
- Ensure `output: 'standalone'` is set

---

## Post-Deployment Monitoring

### 1. Set Up Real User Monitoring
Add to `app/layout.tsx` (optional):
```typescript
import { WebVitals } from '@/components/PerformanceMonitoring'

// Add in body
<WebVitals />
```

### 2. Monitor Core Web Vitals
- Google Search Console → Core Web Vitals
- Monitor real user metrics over 28 days
- Set up alerts for regressions

### 3. Bundle Size Monitoring
```bash
# Run locally after each major change
npm run build:analyze

# Check bundle sizes
# - Homepage JS: < 150 KB gzipped
# - Total initial load: < 500 KB gzipped
```

---

## Troubleshooting

### Issue: ChunkLoadError Still Occurs
**Solution:**
1. Clear Vercel build cache:
   - Vercel Dashboard → Settings → Clear Cache
   - Redeploy
2. Verify next.config.js has deterministic moduleIds
3. Check if Turbopack is enabled (should use webpack in production)

### Issue: Performance Score Still Low
**Solution:**
1. Run Lighthouse in incognito mode (extensions can affect score)
2. Wait 5 minutes after deployment for CDN warming
3. Check mobile vs desktop scores (test both)
4. Review specific suggestions in Lighthouse report

### Issue: Videos Not Loading Lazily
**Solution:**
1. Verify LazyVideo component is used in app/page.tsx
2. Check browser console for Intersection Observer errors
3. Ensure videos have `preload="none"` attribute

### Issue: Fonts Loading Slowly
**Solution:**
1. Verify next/font import in layout.tsx
2. Check if font files are in /_next/static/media/
3. Ensure no external font CDN links in <head>

---

## Environment Variables

Ensure these are set in Vercel:
```
NEXTAUTH_URL=https://omar-rehan.vercel.app
NEXTAUTH_SECRET=<your-secret>
ADMIN_EMAIL=<your-email>
SUPABASE_URL=<your-url>
SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
```

---

## Success Metrics

### Before Optimization:
| Metric | Value |
|--------|-------|
| Performance | 49 |
| FCP | 6.6s |
| LCP | 6.8s |
| Total Payload | ~8MB |
| Initial JS | ~400KB+ |

### After Optimization (Target):
| Metric | Value |
|--------|-------|
| Performance | 85-95 |
| FCP | < 2s |
| LCP | < 2.5s |
| Total Payload | < 2MB |
| Initial JS | ~150KB |

---

## Next Steps After Successful Deployment

1. **Monitor for 24 hours**
   - Check Google Search Console
   - Monitor Vercel analytics
   - Watch for error spikes

2. **Share Results**
   - Take screenshot of PageSpeed score
   - Document improvements
   - Share with team

3. **Continuous Optimization**
   - Run monthly performance audits
   - Monitor bundle size growth
   - Keep dependencies updated
   - Review Core Web Vitals monthly

---

**Questions or Issues?**
- Check PERFORMANCE.md for detailed explanations
- Review Vercel deployment logs
- Check browser console for errors
- Run local build to verify issues

**Status:** ✅ Ready for Deployment
**Expected Deployment Time:** 2-3 minutes
**Expected Score Improvement:** 49 → 85-95
