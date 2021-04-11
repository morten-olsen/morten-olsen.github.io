abstract class BaseService {
  abstract setup: () => Promise<void>
}

export default BaseService;
