package org.example.config;

import org.example.entity.Expense;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;


public class DBConfig {
    private static final SessionFactory SESSION_FACTORY=buildSessionFactory();
    private static SessionFactory buildSessionFactory(){
        Configuration configuration=new Configuration().addAnnotatedClass(Expense.class);

        ServiceRegistry serviceRegistry= new StandardServiceRegistryBuilder().applySettings(configuration.getProperties()).build();

        return configuration.buildSessionFactory(serviceRegistry);
    }
    public static SessionFactory getSessionFactory(){
        return SESSION_FACTORY;
    }
}
