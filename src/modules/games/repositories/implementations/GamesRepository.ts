import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<User[]> {
    this.repository
      .createQueryBuilder("games")


  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT * FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[] | undefined> {

    const games = await this.repository 
                    .createQueryBuilder('games')
                    .leftJoinAndSelect("game.users", "users")
                    .where("game.id = :id", { id: id })
                    .getOne()
    
    return games?.users

  }
}
