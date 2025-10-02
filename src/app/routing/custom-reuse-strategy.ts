import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  // Decides if the route should be reused
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  // Decides if the component should be detached and stored for later
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // We want to cache the 'explore' page
    return route.routeConfig?.path === 'explore';
  }

  // Stores the detached component
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (route.routeConfig?.path && handle) {
      this.storedRoutes.set(route.routeConfig.path, handle);
    }
  }

  // Decides if the component should be re-attached
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // We want to re-attach the 'explore' page if it's in our storage
    return !!route.routeConfig?.path && !!this.storedRoutes.get(route.routeConfig.path);
  }

  // Retrieves the stored component
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig?.path) {
      return null;
    }
    return this.storedRoutes.get(route.routeConfig.path) || null;
  }
}