import { asyncLocalStorage } from '../services/als.service.js';

export function setupAsyncLocalStorage(req, res, next) {
    asyncLocalStorage.run({ loggedinUser: req.loggedinUser || null }, () => {
        next();
      });
    }